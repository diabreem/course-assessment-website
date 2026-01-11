<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

/* ======================
   DATABASE CONNECTION
====================== */
$pdo = new PDO(
    "mysql:host=localhost;dbname=formify;charset=utf8mb4",
    "root",
    "",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

/* ======================
   INPUT (ACADEMIC YEARS)
====================== */
$academicYears = ['2024-2025', '2025-2026'];

/* ======================
   FETCH ALL SUBMISSIONS
====================== */
$stmt = $pdo->prepare("
    SELECT 
        s.submission_id,
        s.academic_year,
        co.semester,
        c.course_code,
        u.first_name AS instructor_first_name,
        u.last_name  AS instructor_last_name
    FROM submissions s
    JOIN course_offerings co ON co.offering_id = s.offering_id
    JOIN courses c ON c.course_id = co.course_id
    JOIN users u ON u.user_id = s.user_id
    WHERE s.academic_year IN (?, ?)
    ORDER BY s.academic_year, c.course_code
");
$stmt->execute($academicYears);
$submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$submissions) {
    die("No submissions found for the given academic years.");
}

/* ======================
   INDEX SUBMISSIONS BY ID
====================== */
$submissionsById = [];
foreach ($submissions as $s) {
    $submissionsById[$s['submission_id']] = $s;
}

/* ======================
   FETCH ALL SUBMISSION VALUES
====================== */
$submissionIds = array_keys($submissionsById);
$placeholders  = implode(',', array_fill(0, count($submissionIds), '?'));

$stmt = $pdo->prepare("
    SELECT 
        sv.submission_id,
        sv.slo_id,
        sv.pc_id,
        sv.field_key,
        sv.value_numeric,
        sv.value_text,
        pc.pc_code,
        pc.description AS pc_description
    FROM submission_values sv
    JOIN pcs pc ON pc.pc_id = sv.pc_id
    WHERE sv.submission_id IN ($placeholders)
");
$stmt->execute($submissionIds);
$values = $stmt->fetchAll(PDO::FETCH_ASSOC);

/* ======================
   FETCH SLO DESCRIPTIONS
====================== */
$stmt = $pdo->query("
    SELECT so_id, description
    FROM slos
");

$sloDescriptions = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $sloDescriptions[$row['so_id']] = $row['description'];
}

/* ======================
   ORGANIZE DATA
====================== */
$reportData = [];

foreach ($values as $v) {
    $submissionId = $v['submission_id'];
    $sloId = $v['slo_id'];
    $pcId  = $v['pc_id'];

    $submission = $submissionsById[$submissionId];

    /* -------- Submission Meta -------- */
    if (!isset($reportData[$submissionId]['_meta'])) {
        $reportData[$submissionId]['_meta'] = [
            'submission_id' => $submissionId,
            'academic_year' => $submission['academic_year'],
            'course_code'   => $submission['course_code'],
            'semester'      => $submission['semester'],
            'instructor'    => trim(
                ($submission['instructor_first_name'] ?? '') . ' ' .
                ($submission['instructor_last_name'] ?? '')
            ),
        ];
    }

    /* -------- SLO Meta -------- */
    if (!isset($reportData[$submissionId]['slos'][$sloId]['_meta'])) {
        $reportData[$submissionId]['slos'][$sloId]['_meta'] = [
            'description' => $sloDescriptions[$sloId] ?? '',
        ];
    }

    /* -------- PC Meta -------- */
    if (!isset($reportData[$submissionId]['slos'][$sloId]['pcs'][$pcId])) {
        $reportData[$submissionId]['slos'][$sloId]['pcs'][$pcId] = [
            'pc_code'     => $v['pc_code'],
            'description' => $v['pc_description'],
            'score'       => null,
            'percent'     => null,
            'result'      => null,
        ];
    }

    /* -------- Map Values -------- */
    if ($v['field_key'] === 'score') {
        $reportData[$submissionId]['slos'][$sloId]['pcs'][$pcId]['score'] = $v['value_numeric'];
    } elseif ($v['field_key'] === 'percent') {
        $reportData[$submissionId]['slos'][$sloId]['pcs'][$pcId]['percent'] = $v['value_numeric'];
    } elseif ($v['field_key'] === 'result') {
        $reportData[$submissionId]['slos'][$sloId]['pcs'][$pcId]['result'] = $v['value_text'];
    }
}

/* ======================
   LOAD TEMPLATE
====================== */
ob_start();
require __DIR__ . '/../templates/report_template.php';
$html = ob_get_clean();

/* ======================
   GENERATE PDF
====================== */
$options = new Options();
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$dompdf->stream(
    "assessment_report_2024_2026.pdf",
    ["Attachment" => false]
);

exit;
