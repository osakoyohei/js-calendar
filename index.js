const week = ["月", "火", "水", "木", "金", "土", "日"];
// 現在の日付、時刻を取得
const today = new Date();
// 現在の年月の1日目を取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 初期表示
window.onload = function () {
    showProcess(today, calendar);
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
    var year = date.getFullYear();
    var month = date.getMonth();
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
                calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降の翌月の日付を設定
                count++;
                calendar += "<td class='disabled'>" + (count - endDate) + "</td>";
            } else {
                count++;
                if(year == today.getFullYear()
                  && month == (today.getMonth())
                  && count == today.getDate()){
                    calendar += "<td class='today'>" + count + "</td>";
                } else {
                    calendar += "<td>" + count + "</td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

// 祝日（API）
async function holidaysApi() {
    const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    const holidays = await res.json();
    console.log(holidays);
}