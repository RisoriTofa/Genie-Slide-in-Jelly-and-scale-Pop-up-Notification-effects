(function(window) {

    /** This enables you to avoid using undeclared variables */
    'use strict';


    /** Get the root element */
         let support = { animations: Modernizr.cssanimations },
            animEndEventNames = {
                'WebkitAnimation': 'webkitAnimationEnd',
                'OAnimation': 'oAnimationEnd',
                'msAnimation': 'MSAnimationEnd',
                'animation': 'animationend'
            },
            // animation end event name
            animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

    /**
     * extend object function
     */
    function extend(a, b) {
        for (let key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * NotificationFx function
     */
    function NotificationFx(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * NotificationFx options
     */
    NotificationFx.prototype.options = {
        // element to which the notification will be appended
        // defaults to the document.body
        notificationWrapper: document.body,
        // the notificationMessage
        notificationMessage: 'Hello!',
        // notification Layout type: growl|attached|bar|other
        notificationLayout: 'growl',
        // effects for the specified notificationLayout:
        // for growl notificationLayout: scale|slide|genie|jelly
        notificationEffect: 'slide',
        // notice, warning, error, success
        // will add class notification-type-warning, notification-type-error or notification-type-success
        notificationType: 'error',
        // if the user does not close the notification then we remove it
        // after the following time
        totalTimeToLeave: 6000,
        // callbacks
        onClose: function() { return false; },
        onOpen: function() { return false; }
    }

    /**
     * init function
     * initialize and cache some vars
     */
    NotificationFx.prototype._init = function() {
        // create HTML structure
        this.ntf = document.createElement('div');
        this.ntf.className = 'ns-box ns-' + this.options.notificationLayout + ' ns-effect-' + this.options.notificationEffect + ' ns-type-' + this.options.notificationType;
        let innerString = '<div class="ns-box-inner">';
        innerString += this.options.notificationMessage;
        innerString += '</div>';
        innerString += '<span class="ns-close"></span></div>';
        this.ntf.innerHTML = innerString;

        // append to body or the element specified in options.notificationWrapper
        // This creates the notification before the first child in the HTML file.
        this.options.notificationWrapper.insertBefore(this.ntf, this.options.notificationWrapper.firstChild);

        // dismiss after [options.totalTimeToLeave]ms
        let self = this;

        if (this.options.totalTimeToLeave) { // checks to make sure totalTimeToLeave is not set to false in notification initialization
            this.dismisstotalTimeToLeave = setTimeout(function() {
                if (self.active) {
                    self.dismiss();
                }
            }, this.options.totalTimeToLeave);
        }

        // init events
        this._initEvents();
    }

    /**
     * init events
     */
    NotificationFx.prototype._initEvents = function() {
        let self = this;
        // dismiss notification
        this.ntf.querySelector('.ns-close').addEventListener('click', function() { self.dismiss(); });
    }

    /**
     * show the notification
     */
    NotificationFx.prototype.show = function() {
        this.active = true;
        classEditor.remove(this.ntf, 'ns-hide');
        classEditor.add(this.ntf, 'ns-show');
        if (typeof this.options.onOpen === 'function')
            this.options.onOpen();
    }

    /**
     * dismiss the notification
     */
    NotificationFx.prototype.dismiss = function() {
        let self = this;
        this.active = false;
        clearTimeout(this.dismisstotalTimeToLeave);
        classEditor.remove(this.ntf, 'ns-show');
        setTimeout(function() {
            classEditor.add(self.ntf, 'ns-hide');

            // callback
            if (typeof self.options.onClose === 'function')
                self.options.onClose();
        }, 25);

        // after animation ends remove ntf from the DOM
        let onEndAnimationFn = function(ev) {
            if (support.animations) {
                if (ev.target !== self.ntf) return false;
                this.removeEventListener(animEndEventName, onEndAnimationFn);
            }
            self.options.notificationWrapper.removeChild(self.ntf);
        };

        if (support.animations) {
            this.ntf.addEventListener(animEndEventName, onEndAnimationFn);
        } else {
            onEndAnimationFn();
        }
    }

    /**
     * add to global namespace
     */
    window.NotificationFx = NotificationFx;

})(window);