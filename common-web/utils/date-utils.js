var lpad = (n) => {
    return ("0"+n).slice(-2);;
}

module.exports = {
    format: function(timestamp) {
        var date = new Date(timestamp);
        var yyyy = date.getFullYear();
        var MM = lpad(date.getMonth() + 1);
        var dd = lpad(date.getDay());
        var hh = lpad(date.getHours());
        var mm = lpad(date.getMinutes());
        var ss = lpad(date.getSeconds());
        return [dd, MM, yyyy].join("/").concat(" ").concat([hh, mm, ss].join(":"));
    } 
}