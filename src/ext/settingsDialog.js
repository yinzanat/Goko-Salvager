/*jslint browser:true, devel:true, white:true, es5:true */
/*globals $ */

$('#viewport')
    .append($('<div>').attr('id', 'settingsDialog')
                      .attr('title', 'Extension Settings')
                      .attr('ng-app', 'settingsApp')
                      .attr('ng-controller', 'settingsController')
        .append($('<div>').text('Autokick:'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'autokick_by_rating')
                            .text('by rating range')
                            .addClass('indented'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'autokick_by_forname')
                            .text('by player name')
                            .addClass('indented'))
        .append($('<div>').text('Notifications:'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'alert_sounds')
                            .text('using sounds')
                            .addClass('indented'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'alert_popups')
                            .text('using popups')
                            .addClass('indented'))
        .append($('<div>').text('Lobby Ratings:'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'sort_rating')
                            .text('Sort players by rating')
                            .addClass('indented'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'proranks')
                            .text('Display pro ratings')
                            .addClass('indented'))
        .append($('<div>').text('VP Counter:'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'logviewer')
                            .text('Show pretty log & VP counter'))
                            .addClass('indented'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'vp_request')
                            .text('Always request (#vpon)')
                            .addClass('indented'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'vp_disallow')
                            .text('Always refuse (#vpoff)')
                            .addClass('indented'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'generator')
                            .text('Kingdom Generator'))
        .append($('<input>').attr('type', 'checkbox')
                            .attr('ng-model', 'always_stack')
                            .text('Stack duplicate cards'))
        .append($('<div>').text('Blacklist:'))
        .append($('<table>')
            .append($('<tbody>')
                .append($('<tr>').attr('ng-repeat', 'pname in blacklist')
                    .append($('<td>').css('color', 'red')
                                    .text('X'))
                    .append($('<span>').text('{{pname}}')))));
//      <td><input type="text" ng:model="temp_bl" /></td>\
//      <td><button  >Add</button></td>\
//      <td><button onclick="$(\'#usDialog\').dialog(\'close\');">Close</td>\
