var appStats = null;

module.exports = {
    get: function () {
        if(appStats == null)
            appStats = {
                increment: function(key) {
                    if(!this[key])
                        this[key] = 0;
                    this[key] += 1;
                },
                count: function(key) {
                    return this[key] ? this[key] : 0;
                }
            };
        return appStats;
    }
}