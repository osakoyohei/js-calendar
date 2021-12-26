const week = ["月", "火", "水", "木", "金", "土", "日"];
// 現在の日付、時刻を取得
const today = new Date();
// 現在の年月の1日目を取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

//　初期表示
window.onload = function () {
    // 祝日API取得
    request = new XMLHttpRequest();
    request.open('get', 'https://holidays-jp.github.io/api/v1/date.csv', true);
    request.send(null);
    request.onload = function () {
        showProcess(today, calendar);
    };
};

// 前の月表示
function prev() {
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

// 次の月表示
function next() {
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

// カレンダー年月表示
function showProcess(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    document.querySelector('#header').innerHTML = year + "年 " + (month + 1) + "月";

    // 2050年まで表示可能
    const nextButton = document.querySelector('#next');
    if (year == 2050 && (month+1) == 12) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }

    var calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    var calendar = "<table><tr>";
    for (var i = 0; i < week.length; i++) {
        calendar += "<th>" + week[i] + "</th>";
    }
    calendar += "</tr>";

    var count = 0;
    // 表示する月の1日の曜日
    var startDayOfWeek = new Date(year, month, 1).getDay();
    // 月曜日始まり
    if (startDayOfWeek == 0) {
        startDayOfWeek = 6;
    } else {
        startDayOfWeek = startDayOfWeek - 1;
    }
    // 表示する月の末日
    var endDate = new Date(year, month + 1, 0).getDate();
    // 表示する先月の末日
    var lastMonthEndDate = new Date(year, month, 0).getDate();
    //　カレンダー（日付部分）の行数
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        calendar += "<tr>";
        for (var j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
            // 1行目で先月の最終日までの日付を設定
            calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "日" + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降の翌月の日付を設定
                count++;
                calendar += "<td class='disabled'>" + (count - endDate) + "日" + "</td>";
            } else {
                count++;
                var dateInfo = checkDate(year, month, count);
                if(dateInfo.isHoliday) {
                    calendar += "<td class='holiday'>" + count + "日" + "<br>" + "<span class='holiday-name'>" + dateInfo.holidayName + "</span>"+ "</td>";
                } else {
                    calendar += "<td>" + count + "日" + "</td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

// 日付チェック
function checkDate(year, month, day) {
    var checkHoliday = isHoliday(year, month, day);
    return {
        isHoliday: checkHoliday[0],
        holidayName: checkHoliday[1],
    };
}

// 祝日かどうか
function isHoliday(year, month, day) {
    var checkDate = year + '-' + ('0'+(month+1)).slice(-2) + '-' + ('0'+day).slice(-2);
    var dateList = request.responseText.split('\n');
    
    for (var i = 1; i < dateList.length; i++) {
        if (dateList[i].split(',')[0] === checkDate) {
            return [true, dateList[i].split(',')[1]];
        }
    }
    return [false, ""];
}