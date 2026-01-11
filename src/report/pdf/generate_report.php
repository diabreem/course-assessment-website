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
   INPUT
====================== */
$submissionId = $_GET['submission_id'] ?? null;
if (!$submissionId) {
    die("Missing submission_id");
}

/* ======================
   FETCH SUBMISSION
====================== */
$stmt = $pdo->prepare("SELECT * FROM submissions WHERE submission_id = ?");
$stmt->execute([$submissionId]);
$submission = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$submission) {
    die("Submission not found");
}

/* ======================
   FETCH VALUES
====================== */
$stmt = $pdo->prepare("
    SELECT 
        s.*,
        co.semester,
        c.course_code,
        u.first_name AS instructor_first_name,
        u.last_name AS instructor_last_name
    FROM submissions s
    JOIN course_offerings co ON co.offering_id = s.offering_id
    JOIN courses c ON c.course_id = co.course_id
    JOIN users u ON u.user_id = s.user_id
    WHERE s.submission_id = ?
");
$stmt->execute([$submissionId]);
$submission = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$submission) {
    die('Submission not found');
}

/* ======================
   FETCH SUBMISSION VALUES
====================== */
$stmt = $pdo->prepare("
    SELECT 
        sv.slo_id,
        sv.pc_id,
        sv.field_key,
        sv.value_numeric,
        sv.value_text,
        pc.pc_code,
        pc.description AS pc_description
    FROM submission_values sv
    JOIN pcs pc ON pc.pc_id = sv.pc_id
    WHERE sv.submission_id = ?
");
$stmt->execute([$submissionId]);
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
$bySO = [];

foreach ($values as $v) {
    $sloId = $v['slo_id'];
    $pcId  = $v['pc_id'];

    // SO meta
    if (!isset($bySO[$sloId]['_meta'])) {
        $bySO[$sloId]['_meta'] = [
            'description' => $sloDescriptions[$sloId] ?? '',
            'course_code' => $submission['course_code'],
            'instructor'  => trim(
                ($submission['instructor_first_name'] ?? '') . ' ' .($submission['instructor_last_name'] ?? '')
            ),
            'semester'    => $submission['semester'],
        ];
    }

    // PC meta
    if (!isset($bySO[$sloId]['pcs'][$pcId])) {
        $bySO[$sloId]['pcs'][$pcId] = [
            'pc_code'    => $v['pc_code'],
            'description'=> $v['pc_description'],
            'score'      => null,
            'percent'    => null,
            'result'     => null,
        ];
    }

    // Map values
    if ($v['field_key'] === 'score') {
        $bySO[$sloId]['pcs'][$pcId]['score'] = $v['value_numeric'];
    }
    elseif ($v['field_key'] === 'percent') {
        $bySO[$sloId]['pcs'][$pcId]['percent'] = $v['value_numeric'];
    }
    elseif ($v['field_key'] === 'result') {
        $bySO[$sloId]['pcs'][$pcId]['result'] = $v['value_text'];
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
$dompdf->stream("submission_$submissionId.pdf", ["Attachment" => false]);
exit;
