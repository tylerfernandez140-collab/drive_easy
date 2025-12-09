<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>DriveEasy - Certificate of Completion</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
            background-color: #f9f9f9;
            color: #333;
        }

        .certificate-container {
            border: 15px solid #2c5fa8;
            padding: 50px;
            background-color: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            position: relative;
        }

        .logo {
            max-width: 100px;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 32px;
            color: #2c5fa8;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .certificate-of {
            font-size: 24px;
            margin-bottom: -10px;
        }

        .student-name {
            font-size: 36px;
            font-weight: bold;
            color: #2c5fa8;
            margin: 30px 0;
            padding: 10px 0;
            border-top: 2px solid #2c5fa8;
            border-bottom: 2px solid #2c5fa8;
        }

        .course-info {
            font-size: 20px;
            margin: 25px 0;
            line-height: 1.6;
        }

        .date {
            font-size: 18px;
            margin-top: 40px;
            font-style: italic;
        }

        .signature-line {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            width: 80%;
            margin-left: auto;
            margin-right: auto;
        }

        .signature {
            border-top: 1px solid #333;
            width: 200px;
            text-align: center;
            padding-top: 5px;
        }

        .seal {
            position: absolute;
            right: 60px;
            bottom: 60px;
            opacity: 0.8;
            width: 100px;
        }
    </style>
</head>

<body>
    <div class="certificate-container">
        <img src="{{ $logo }}" alt="DriveEasy Logo" class="logo">

        <p class="certificate-of">Certificate of</p>
        <h1>Completion</h1>
        <p>This certifies that</p>
        <div class="student-name">{{ $student->first_name }} {{ $student->last_name }}</div>

        <div class="course-info">
            has successfully completed the<br>
            <strong>{{ ucfirst($courseType) }} Course @if($courseDuration !== 'N/A') ({{ $courseDuration }}) @endif</strong><br>
            offered by DriveEasy Driving School
        </div>

        <div class="date">Issued on: {{ now()->format('F d, Y') }}</div>

        <div class="signature-line">
            <div class="signature">{{ $instructorName }}</div>
            <div class="signature">Instructor</div>
        </div>

        <img src="https://via.placeholder.com/100x100?text=Official+Seal" alt="Official Seal" class="seal">
    </div>
</body>

</html>