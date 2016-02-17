
import T from 'typr'
import assert from 'assert'
import passport_local from 'passport-local'

import AuthenticationPluginPassport from './authentication_plugin_passport'


let context = 'common/security/authentication_plugin_passport_local'



/**
 * Authentication class for Passport Local strategy.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPluginPassportLocal extends AuthenticationPluginPassport
{
    /**
     * Create an Authentication plugin class based on passport local strategy.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_passport_local = true
	}
    
    
    /**
     * Get Passport strategy provided by this class.
     * @returns {object} - Passport strategy instance
     */
    get_passport_strategy()
    {
        var LocalStrategy = passport_local.Strategy
        
        // BUILD LOCAL STRATEGY SETTINGS
        const settings = {}
        if (this.username_fieldname)
        {
            settings.usernameField = this.username_fieldname
        }
        if (this.password_fieldname)
        {
            settings.passwordField = this.password_fieldname
        }
        if (this.success_redirect)
        {
            settings.successRedirect = this.success_redirect
        }
        if (this.failure_redirect)
        {
            settings.failureRedirect = this.failure_redirect
        }
        settings.failureFlash = true
        
        // CREATE AND RETURN A LOCAL STRATEGY INSTANCE
        return new LocalStrategy(
            settings,
            function(arg_username, arg_password, arg_done_cb)
            {
                const credentials = { 'user':arg_username, 'password':arg_password, 'done_cb':arg_done_cb }
                this.authenticate(credentials)
            }
        )
    }
}
