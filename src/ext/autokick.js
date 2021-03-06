/*jslint browser: true, devel: true, indent: 4, vars: true, nomen: true, regexp: true, forin: true, white:true */
/*global $, _, Audio */

/*
 * Auto kick module
 */
var loadAutokickModule = function (gs, zch) {
    "use strict";

    var getProRating, kickOrNotify, kickOrNotify2;

    getProRating = function (gokoconn, playerId, callback) {
        gokoconn.getRating({
            playerId: playerId,
            ratingSystemId: '501726b67af16c2af2fc9c54'
        }, function (resp) {
            return callback(resp.data.rating);
        });
    };

    kickOrNotify = function (gokoconn, table, joiner) {

        // Asynchronously get my rating
        getProRating(gokoconn, gokoconn.connInfo.playerId, function (myRating) {
            if (typeof myRating === 'undefined') {
                gs.debug('No pro rating found for me -- using 1000');
                myRating = 1000;
            }

            // Asynchronously get joiner's rating
            getProRating(gokoconn, joiner.get('playerId'), function (hisRating) {
                if (typeof hisRating === 'undefined') {
                    gs.debug('No pro rating found for ' + joiner.get('playerName') + ' -- using 1000');
                    hisRating = 1000;
                }

                kickOrNotify2(gokoconn, table, joiner, myRating, hisRating);
            });
        });
    };

    kickOrNotify2 = function (gokoconn, table, joiner, myRating, hisRating) {
        var shouldKick = false;
        var hisName = joiner.get('playerName');
        var tablename = null;
        if (table !== null) {
            var tableSettings = table.get('settings');
            if (tableSettings !== null && tableSettings !== '') {
                tablename = JSON.parse(tableSettings).name || tablename;
            }
        }

        // Kick players whose ratings are too high or too low for me
        if (gs.get_option('autokick_by_rating') && tablename !== null) {

            var range = gs.parseRange(tablename, myRating);
            var minRating = range[0];
            var maxRating = range[1];

            if ((minRating && hisRating < minRating)
                    || (maxRating && hisRating > maxRating)) {
                gs.debug(hisName + 'is outside my rating range... kicking');
                shouldKick = true;
            }
        }
        
        // Kick players not listed in "For X, Y, ..."
        if (gs.get_option('autokick_by_forname') && tablename !== null) {
            var m = tablename.toLowerCase().match(/for (.*)/);
            if (m && m[1].indexOf(hisName.toLowerCase()) < 0) {
                gs.debug(hisName + 'is not my requested opponent... kicking');
                shouldKick = true;
            }
        }

        // Kick players on my blacklist
        var i, blackList = gs.get_option('blacklist');
        for (i = 0; i < blackList.length; i += 1) {
            if (blackList[i].toLowerCase() === hisName.toLowerCase()) {
                gs.debug(hisName + 'is on my blacklist... kicking');
                shouldKick = true;
            }
        }

        // Never kick bots
        if (joiner.get('isBot')) {
            gs.debug(hisName + ' is a bot... not kicking.');
            shouldKick = false;
        } 

        // Kick joiner or play a sound to notify of successful join
        if (shouldKick) {
            gokoconn.bootTable({
                table: table.get('number'),
                playerAddress: joiner.get('playerAddress')
            });
        } else {
            gs.alertPlayer('Opponent joined', new Audio('sounds/startTurn.ogg'));
        }
    };

    gs.alsoDo(zch, 'onPlayerJoinTable', null, function (t, tp) {
        if (this.isLocalOwner(t)) {
            kickOrNotify(this.meetingRoom.conn, t, tp.get('player'));
        }
    });
};

window.GokoSalvager.depWait(
    ['GokoSalvager',
     'FS.ZoneClassicHelper'],
    100, loadAutokickModule, this, 'Autokick module'
);
