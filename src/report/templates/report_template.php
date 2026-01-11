<style>
    .label {
        display: inline-block;
        margin-bottom: 6px;
        vertical-align: top;
        margin-right: 3px;
    }
    
    .checkbox {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 1px solid #000;
        vertical-align: middle;
    }
    
    .checkbox.checked {
        background: #000;
    }    

    body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
    }
    .header {
        background: #000;
        color: #fff;
        font-weight: bold;
        padding: 6px;
        font-size: 13px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 6px;
    }
    th, td {
        border: 1px solid #000;
        padding: 6px;
        vertical-align: top;
    }
    th {
        text-align: center;
        font-weight: bold;
    }
    .center { text-align: center; }
    .red { color: red; font-weight: bold; }
    .green { color: green; font-weight: bold; }
    .section-row {
        font-weight: bold;
        background: #f5f5f5;
    }
    .submission-meta {
        margin: 8px 0;
        font-size: 11px;
    }
    
    </style>

    <div class="header">I. ASSESSMENT BACKGROUND</div>

    <table>
    <tr>
        <td class="left"><strong>Performing Agent</strong></td>
        <td>Dean's Office, Assessment Officer</td>
    </tr>

    <tr>
        <td class="left"><strong>Semester</strong></td>
        <td>Spring 2025</td>
    </tr>

    <tr>
        <td class="left"><strong>Updated Campus</strong></td>
        <td>Byblos</td>
    </tr>

    <tr>
        <td class="left"><strong>Assessment Method</strong></td>
        <td>
            <?php foreach ($allAssessmentMethods as $method): ?>
                <?php $checked = isset($methodsUsed[$method['method_id']]); ?>
                <span class="label">
                    <span class="checkbox <?= $checked ? 'checked' : '' ?>"></span>
                    <?= htmlspecialchars($method['method_name']) ?>
                </span>
            <?php endforeach; ?>
        </td>
    </tr>
    
    <tr>    
        <td class="left"><strong>Assessment Context</strong></td>
        <td>
            <?php foreach ($allCourses as $course): ?>
                <?php $checked = isset($courseIdsWithSubmissions[$course['course_id']]); ?>
                <span class="label">
                    <span class="checkbox <?= $checked ? 'checked' : '' ?>"></span>
                    <?= htmlspecialchars($course['course_code']) ?>
                </span>
            <?php endforeach; ?>
        </td>
    </tr>
    </table>

    <br>


    
    <?php foreach ($reportData as $submission): ?>
    
    <div class="header">
        V. STUDENT LEARNING OUTCOMES ASSESSMENT SUMMARY
    </div>
    
    <table>
    <thead>
    <tr>
        <th style="width:20%">Student Learning Outcomes</th>
        <th style="width:14%">Source of Assessment</th>
        <th style="width:12%">Assessment Method</th>
        <th style="width:8%">Number of Students</th>
        <th style="width:8%">Average Score</th>
        <th style="width:10%">Percentage Met</th>
        <th style="width:10%">Performance Standard used</th>
        <th style="width:8%">Target</th>
        <th style="width:10%">Data Interpretation</th>
    </tr>
    </thead>
    
    <tbody>
    
    <?php foreach ($submission['slos'] as $sloId => $so): ?>
    
    <tr class="section-row">
        <td colspan="9">
            <strong>
                SO.<?= htmlspecialchars($sloId) ?>:
                <?= htmlspecialchars($so['_meta']['description']) ?>
            </strong>
        </td>
    </tr>
    
    <?php foreach ($so['pcs'] as $pc): 
        $meets = $pc['percent'] !== null && $pc['percent'] >= 70;
    ?>
    
    <tr>
        <td>
            <strong><?= htmlspecialchars($pc['pc_code']) ?></strong><br>
            <?= htmlspecialchars($pc['description']) ?>
        </td>
    
        <td class="center">
            <?= htmlspecialchars($submission['_meta']['course_code']) ?><br>
            <?= htmlspecialchars($submission['_meta']['instructor']) ?><br>
            <?= htmlspecialchars($submission['_meta']['semester']) ?>
        </td>
    
        <td class="center">Embedded<br>Assessment</td>
    
        <td class="center">-</td>
    
        <td class="center">
            <?= htmlspecialchars($pc['score'] ?? '-') ?>
        </td>
    
        <td class="center <?= $meets ? 'green' : 'red' ?>">
            <?= $pc['percent'] !== null ? $pc['percent'] . '%' : '-' ?>
        </td>
    
        <td class="center">65</td>
    
        <td class="center">
            70%<br>Meeting<br>Performance<br>Standard
        </td>
    
        <td class="center <?= $meets ? 'green' : 'red' ?>">
            <?= htmlspecialchars($pc['result'] ?? '-') ?>
        </td>
    </tr>
    
    <?php endforeach; ?>
    <?php endforeach; ?>
    
    </tbody>
    </table>
    
    <?php endforeach; ?>
    
