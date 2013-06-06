package cn.sdh.audit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.util.Assert;

import cn.sdh.common.listener.ActiveUserListener;

/**
 * 自定义登出处理器
 * 
 * @author 孙东辉 2011-9-6
 */
public class MySecurityContextLogoutHandler implements LogoutHandler {

	private boolean invalidateHttpSession = true;

	/**
	 * Requires the request to be passed in.
	 * 
	 * @param request
	 *            from which to obtain a HTTP session (cannot be null)
	 * @param response
	 *            not used (can be <code>null</code>)
	 * @param authentication
	 *            not used (can be <code>null</code>)
	 */
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		Assert.notNull(request, "HttpServletRequest required");

		if (invalidateHttpSession) {
			HttpSession session = request.getSession(false);
			if (session != null) {
				session.invalidate();
			}
		}
		
		ActiveUserListener.deleteActiveUser(authentication.getName(), request.getSession().getId());

		SecurityContextHolder.clearContext();
	}

	public boolean isInvalidateHttpSession() {
		return invalidateHttpSession;
	}

	/**
	 * Causes the {@link HttpSession} to be invalidated when this
	 * {@link LogoutHandler} is invoked. Defaults to true.
	 * 
	 * @param invalidateHttpSession
	 *            true if you wish the session to be invalidated (default) or
	 *            false if it should not be.
	 */
	public void setInvalidateHttpSession(boolean invalidateHttpSession) {
		this.invalidateHttpSession = invalidateHttpSession;
	}

}
