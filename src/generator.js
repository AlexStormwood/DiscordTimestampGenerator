var formatRules = [
    {
        name: "shorttime", code: "t", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            return `${tempDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${tempDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        }
    },
    {
        name: "longtime", code: "T", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            return `${tempDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${tempDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${tempDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        }
    },
    {
        name: "shortdate", code: "d", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            return `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        }
    },
    {
        name: "longdate", code: "D", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            return `${tempDate.getDate()} ${tempDate.toLocaleString('default', { month: 'long' })} ${tempDate.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        }
    },
    {
        name: "shortdatetime", code: "f", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            return `${tempDate.getDate()} ${tempDate.toLocaleString('default', { month: 'long' })} ${tempDate.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} ${tempDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${tempDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        }
    },
    {
        name: "longdatetime", code: "F", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            return `${tempDate.toLocaleString('default', { weekday: 'long' })}, ${tempDate.getDate()} ${tempDate.toLocaleString('default', { month: 'long' })} ${tempDate.getFullYear()} ${tempDate.getHours()}:${tempDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        }
    },
    {
        name: "relative", code: "R", appearance: function (unixTimestamp) {
            let tempDate = new Date(unixTimestamp);
            let dateNow = Date.now();
            let secondsDiff = Math.floor((tempDate - dateNow) / 1000);
            const rtf1 = new Intl.RelativeTimeFormat('en', {
                style: 'long',
                numeric: 'auto',
                localeMatcher: "best fit"
            });

            let interval = secondsDiff / 31536000;
            if (interval > 1 || interval < -1) {
                return rtf1.format(Math.round(interval), 'years');
            }
            interval = secondsDiff / 2592000;
            if (interval > 1 || interval < -1) {
                return rtf1.format(Math.round(interval), 'months');
            }
            interval = secondsDiff / 86400;
            if (interval > 1 || interval < -1) {
                return rtf1.format(Math.round(interval), 'days');
            }
            interval = secondsDiff / 3600;
            if (interval > 1 || interval < -1) {
                return rtf1.format(Math.round(interval), 'hours');
            }
            interval = secondsDiff / 60;
            if (interval > 1 || interval < -1) {
                return rtf1.format(Math.round(interval), 'minutes');
            }
            return rtf1.format(secondsDiff, 'seconds');


        }
    },
];


var possibleCellIDs = new Array();
formatRules.forEach(obj => {
    possibleCellIDs.push(`a_${obj.name}`, `c_${obj.name}`)
    obj.a = "a_" + obj.name;
    obj.c = "c_" + obj.name;
})

function unixTimestampGenerator(timestampJS) {
    let timestampProvided = new Date(timestampJS);
    let unixTimestamp = timestampProvided.getTime() / 1000;
    return unixTimestamp;
}

function getFormData() {
    let datetimeField = document.getElementById("i_datetime");
    tableGenerator(unixTimestampGenerator(datetimeField.value));
}

function tableGenerator(unixTimestamp) {
    let tableCells = Array.from(document.getElementsByTagName("td"));
    tableCells.forEach(cell => {
        let matchingRule = formatRules.find(obj => {
            return obj.a == cell.id || obj.c == cell.id
        });
        if (matchingRule) {
            if (cell.id.charAt(0) == "c") {
                cell.innerText = `<t:${unixTimestamp}:${matchingRule.code}>`
            }
            if (cell.id.charAt(0) == "a") {
                let styleRule = cell.id.toString();
                styleRule = styleRule.slice(2);
                cell.innerText = matchingRule.appearance(unixTimestamp * 1000);
            }
        }
    });

}
