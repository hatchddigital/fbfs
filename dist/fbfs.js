/*! Facebook Friend Search - v0.1.2 - 2013-04-10
* https://github.com/hatchddigital/fbfs
* Copyright (c) 2013 Hatchd Digital; Licensed MIT */

/*jshint camelcase:false, laxcomma:true */
/*global FB, Handlebars, jQuery */

window.FBFS = (function($) {
    'use strict';

    /**
     * FBFS constructor method. Will return a Facebook Friend Search
     * object when called with `new FBFS()` with all attached listeners,
     * templates and object methods.
     *
     * Module must be created with an HTML element and can be passed a
     * set of options/callbacks for user customization.
     *
     * OPTIONS:
     * > None
     *
     * CALLBACKS:
     * > onUserSelect(user)
     *  :: Method will be called any time a user selects one of their
     *     FB friends. The Method will be passed a JSON object representing
     *     the friend.
     *
     * @param {HTML} element The HTML element to attach the FBFS on.
     * @param {JSON} options JSON settings matching available user options.
     */
    var FBFS = function FBFS(element, options) {
        var that = this;
        // Set and extend default options with user provided
        this.options = $.extend({
            'onUserSelect': false,
            'user_limit': 10,
            'userTemplate': this.userTemplate,
            'autoclose': true
        }, options);
        this.$element = $(element);
        that.$element.find('.facebook-friends').addClass('state-empty');
        /**
         * Attach events
         */
        var $search = this.$element.find('.search');
        var $clear_search = this.$element.find('.search-clearinput');
        // Every change to the value do a search
        $search.on('keyup', function () {
            that.onSearch($(this).val());
        });
        // Clear the field and clear the search by doing an empty search
        $clear_search.on('click', function () {
            $search.val('').trigger('keyup');
        });
        return this;
    };

    /**
     * Requests the current users friends that match a string search
     * provided by the user. This will update the friend list with any
     * friends that match.
     * @param  {string} str User supplied to match against user's friends
     * @return null
     */
    FBFS.prototype.onSearch = function onSearch(str) {
        var that = this
          , query = this.searchUsersFQL({
                'name': str.toLowerCase(),
                'limit': that.options.user_limit
            })
          , $list = $('<ul class="facebook-friends"></ul>')
          , $friends_list = this.$element.find('.facebook-friends');

        // Don't search unless the string is acceptable, delete all
        if (!str.length) {
            $friends_list.replaceWith($list);
            that.$element.find('.facebook-friends').addClass('state-empty');
            return;
        }

        // Set searching flag for UI changes
        that.$element.addClass('state-searching');
        FB.api({
            'method': 'fql.query',
            'query': query
        },
        function (response) {
            var $li, i, callback;

            // Done searching how should we handle this error?
            if (typeof response.error_code === 'string') {
                return false;
            }

            that.$element.removeClass('state-searching');

            if (response.length) {
                that.$element.find('.facebook-friends').removeClass('state-empty');
                for (i = response.length - 1; i >= 0; i--) {
                    $li = $(that.options.userTemplate(response[i]));
                    $li.data('user', response[i]);
                    $list.append($li);
                }
                $friends_list.replaceWith($list);
            }
            else {
                that.$element.find('.facebook-friends').addClass('state-empty');
            }

            // Callback, if set.
            callback = that.options.onUserSelect;
            $list.find('li').on('click', function () {
                if (callback && typeof callback === 'function') {
                    callback.call(that, $(this).data('user'));
                }
                // Hide dropdown on select, if asked
                if (that.options.autoclose) {
                    $list.html('');
                }
            });
        });
    };

    /**
     * Handlebar template for found user
     * @type {json}     Provide data to match required template values.
     *   {
     *     name  Facebook user's full name
     *     uid   Facebook user id
     *   }
     * @return {string} HTML from compiled template
     */
    FBFS.prototype.userTemplate = Handlebars.compile(
        '<li class="fbfs-user">' +
            '<img alt="Portrait of {{name}}" class="fb-profileimg" ' +
                  'src="https://graph.facebook.com/{{uid}}/picture" />'+
             '<a id="{{uid}}" class="fb-name" href="#">{{name}}</a>' +
        '</li>');

    /**
     * Facebook query to search for all your friends matching a
     * specific name string. (e.g. ja for jason)
     * @type {json}     Provide data to match required template values.
     *   {
     *     name  String to match against users
     *   }
     * @return {string} HTML from compliled template
     */
    FBFS.prototype.searchUsersFQL = Handlebars.compile(
        'SELECT uid, username, first_name, last_name, name ' +
        'FROM user ' +
        'WHERE uid IN ' +
            '(SELECT uid2 ' +
            ' FROM friend ' +
            ' WHERE uid1 = me()) ' +
        'AND strpos(lower(name),\'{{name}}\') >= 0' +
        'LIMIT {{limit}}');

    /**
     * jQuery function for launching FBFS modules on HTML elements.
     * @param  {json} options   A set of options/callbacks to customize FBFS
     * @return {null}
     */
    $.fn.fbfs = function (options) {
        options = options || {};
        this.each(function () {
            return new FBFS(this, options);
        });
    };

    return FBFS;

}(jQuery));
