def generate_html_report(result: dict, title="مجتمع مشترون") -> str:
    """
    Generate a modern HTML report from procurement system output
    
    Args:
        result: Dictionary with procurement calculation results
        title: Report title/header
        
    Returns:
        Complete HTML document as string
    """
    
    # Extract data for easier access
    proc_type = result.get('procurement_type', 'غير محدد')
    budget = result.get('budget', 0)
    total_duration = result.get('total_duration', 0)
    stages = result.get('stages', [])
    guidelines = result.get('implementation_guidelines', '')
    articles = result.get('referenced_articles', [])
    
    # Format articles references if any
    articles_text = ""
    if articles:
        articles_text = f"المواد المرجعية: {', '.join([str(art) for art in articles])}"
    
    # Create timeline HTML
    timeline_html = ""
    if stages:
        timeline_html = """
        <div class="timeline-container">
            <div class="timeline">
        """
        
        for i, stage in enumerate(stages):
            position = "right" if i % 2 == 0 else "left"
            is_working = "أيام عمل" if stage.get('is_working_days', True) else "أيام تقويمية"
            duration = stage.get('duration', 0)
            notes = stage.get('notes', '')
            notes_html = f'<div class="timeline-notes">{notes}</div>' if notes else ''
            
            timeline_html += f"""
                <div class="timeline-item timeline-item-{position}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">{stage.get('start_date', '')}</div>
                        <h3>{stage.get('name', '')}</h3>
                        <div class="timeline-duration">المدة: {duration} {is_working}</div>
                        <div class="timeline-end-date">تاريخ الانتهاء: {stage.get('end_date', '')}</div>
                        {notes_html}
                    </div>
                </div>
            """
        
        timeline_html += """
            </div>
        </div>
        """
    
    # Create specifications table
    specs_table = """
    <div class="specs-container">
        <h2>تفاصيل المنافسة</h2>
        <table class="specs-table">
            <tr>
                <th>البند</th>
                <th>القيمة</th>
            </tr>
            <tr>
                <td>أسلوب الطرح</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>مدة الطرح</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>مدة الطرح المعدلة</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>عدد المشاركين المطلوب</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>أولوية الشركات الصغيرة والمتوسطة</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>ضمان الأداء</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>الضمان الابتدائي</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>الضمان النهائي</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>هيكل الملفات</td>
                <td>{}</td>
            </tr>
            <tr>
                <td>المدة الإجمالية</td>
                <td>{} يوم</td>
            </tr>
        </table>
    </div>
    """.format(
        result.get('procurement_type', ''),
        result.get('announcement_period', ''),
        result.get('review_period', ''),
        result.get('required_participants', ''),
        result.get('sme_priority', ''),
        result.get('performance_guarantee', ''),
        result.get('initial_guarantee', ''),
        result.get('final_guarantee', ''),
        result.get('file_structure', ''),
        result.get('total_duration', '')
    )
    
    # Create guidelines section
    guidelines_html = ""
    if guidelines:
        guidelines_html = f"""
        <div class="guidelines-container">
            <h2>ضوابط تحقيق الأسلوب</h2>
            <div class="guidelines-content">
                <p>{guidelines}</p>
                <p class="articles">{articles_text}</p>
            </div>
        </div>
        """
    
    # Complete HTML document
    html = f"""<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - تقرير المنافسة</title>
    <style>
        /* Global Styles */
        :root {{
            --primary-color: #1e88e5;
            --secondary-color: #f5f5f5;
            --accent-color: #ff9800;
            --text-color: #333;
            --light-text: #777;
            --border-color: #ddd;
            --success-color: #4caf50;
            --warning-color: #ff9800;
            --danger-color: #f44336;
        }}
        
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }}
        
        body {{
            background-color: #f9f9f9;
            color: var(--text-color);
            line-height: 1.6;
            padding: 0;
            margin: 0;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }}
        
        /* Header */
        .header {{
            background: linear-gradient(to left, #1a237e, #283593);
            color: white;
            padding: 30px 0;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.2em;
            margin: 0;
        }}
        
        .header p {{
            margin-top: 10px;
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        /* Summary Card */
        .summary-card {{
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 30px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }}
        
        .summary-item {{
            flex: 1 0 200px;
            margin: 10px;
            text-align: center;
        }}
        
        .summary-item h3 {{
            color: var(--light-text);
            font-size: 1em;
            margin-bottom: 10px;
        }}
        
        .summary-item p {{
            font-size: 1.8em;
            font-weight: bold;
            color: var(--primary-color);
        }}
        
        /* Timeline - FIXED */
        .timeline-container {{
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 30px;
        }}
        
        .timeline-container h2 {{
            text-align: center;
            margin-bottom: 30px;
            color: var(--primary-color);
        }}
        
        .timeline {{
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        /* Create the timeline line */
        .timeline::after {{
            content: '';
            position: absolute;
            width: 6px;
            background-color: var(--secondary-color);
            top: 0;
            bottom: 0;
            left: 50%;
            margin-left: -3px;
            z-index: 1;
        }}
        
        /* Timeline item container */
        .timeline-item {{
            position: relative;
            width: 100%;
            margin-bottom: 30px;
        }}
        
        /* Timeline dot centered on the line */
        .timeline-dot {{
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: var(--primary-color);
            border: 4px solid #fff;
            border-radius: 50%;
            z-index: 2;
            left: 50%;
            top: 20px;
            margin-left: -10px;
        }}
        
        /* Content for right side items */
        .timeline-item-right .timeline-content {{
            margin-right: 0;
            margin-left: 50%;
            padding: 20px 30px 20px 20px;
            text-align: right;
        }}
        
        /* Content for left side items */
        .timeline-item-left .timeline-content {{
            margin-right: 50%;
            margin-left: 0;
            padding: 20px 20px 20px 30px;
            text-align: right;
        }}
        
        .timeline-content {{
            position: relative;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            width: 45%;
        }}
        
        /* Arrow for right items */
        .timeline-item-right .timeline-content::before {{
            content: '';
            position: absolute;
            top: 22px;
            right: 100%;
            border: 10px solid transparent;
            border-left: 0;
            border-right-color: white;
        }}
        
        /* Arrow for left items */
        .timeline-item-left .timeline-content::before {{
            content: '';
            position: absolute;
            top: 22px;
            left: 100%;
            border: 10px solid transparent;
            border-right: 0;
            border-left-color: white;
        }}
        
        .timeline-date {{
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 10px;
        }}
        
        .timeline-content h3 {{
            margin-top: 0;
            color: var(--primary-color);
            font-size: 1.2em;
        }}
        
        .timeline-duration {{
            margin: 10px 0;
            font-weight: bold;
        }}
        
        .timeline-end-date {{
            margin: 10px 0;
            color: var(--light-text);
        }}
        
        .timeline-notes {{
            margin-top: 10px;
            padding: 8px;
            background-color: #fff9c4;
            border-radius: 4px;
            font-size: 0.9em;
        }}
        
        /* Guidelines */
        .guidelines-container {{
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 30px;
        }}
        
        .guidelines-container h2 {{
            text-align: center;
            margin-bottom: 20px;
            color: var(--primary-color);
        }}
        
        .guidelines-content {{
            line-height: 1.8;
        }}
        
        .guidelines-content p {{
            margin-bottom: 15px;
        }}
        
        .guidelines-content .articles {{
            font-weight: bold;
            color: var(--primary-color);
        }}
        
        /* Specifications Table */
        .specs-container {{
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 30px;
        }}
        
        .specs-container h2 {{
            text-align: center;
            margin-bottom: 20px;
            color: var(--primary-color);
        }}
        
        .specs-table {{
            width: 100%;
            border-collapse: collapse;
        }}
        
        .specs-table th, .specs-table td {{
            padding: 12px 15px;
            text-align: right;
            border-bottom: 1px solid var(--border-color);
        }}
        
        .specs-table th {{
            background-color: var(--secondary-color);
            font-weight: bold;
            color: var(--primary-color);
        }}
        
        .specs-table tr:last-child td {{
            border-bottom: none;
        }}
        
        .specs-table tr:hover {{
            background-color: rgba(0,0,0,0.02);
        }}
        
        /* Footer */
        .footer {{
            text-align: center;
            padding: 20px;
            margin-top: 30px;
            color: var(--light-text);
            font-size: 0.9em;
        }}
        
        /* Responsive */
        @media screen and (max-width: 768px) {{
            /* Timeline becomes single column on mobile */
            .timeline::after {{
                left: 30px;
            }}
            
            .timeline-item-left .timeline-content,
            .timeline-item-right .timeline-content {{
                width: calc(100% - 70px);
                margin-right: 0;
                margin-left: 70px;
                padding: 15px;
                text-align: right;
            }}
            
            .timeline-dot {{
                left: 30px;
                margin-left: 0;
            }}
            
            .timeline-item-left .timeline-content::before,
            .timeline-item-right .timeline-content::before {{
                top: 22px;
                right: 100%;
                border: 10px solid transparent;
                border-left: 0;
                border-right-color: white;
                left: auto;
            }}
            
            .summary-item {{
                flex: 1 0 100%;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{title}</h1>
        <p>تقرير المنافسة</p>
    </div>
    
    <div class="container">
        <div class="summary-card">
            <div class="summary-item">
                <h3>أسلوب الطرح</h3>
                <p>{proc_type}</p>
            </div>
            <div class="summary-item">
                <h3>المدة الإجمالية</h3>
                <p>{total_duration} يوم</p>
            </div>
            <div class="summary-item">
                <h3>عدد المراحل</h3>
                <p>{len(stages)}</p>
            </div>
        </div>
        
        <div class="timeline-container">
            <h2>الجدول الزمني للمنافسة</h2>
            {timeline_html}
        </div>
        
        {guidelines_html}
        
        {specs_table}
    </div>
    
    <div class="footer">
        <p>© {title} - تم إنشاء هذا التقرير تلقائياً</p>
    </div>
</body>
</html>
    """
    
    return html


def save_html_report(result: dict, filename: str, title="مجتمع مشترون") -> None:
    """
    Generate HTML report and save to file
    
    Args:
        result: Dictionary with procurement calculation results
        filename: Output file path
        title: Report title
    """
    html = generate_html_report(result, title)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Report saved to {filename}")