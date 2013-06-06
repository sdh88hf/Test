package cn.sdh.utils;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import cn.sdh.entity.Account;

/**
 * 本类只支持SpringSecurity 3.0.x.
 * 
 * @author 孙东辉 2011-4-26
 */
public class SpringSecurityUtils {

	/**
	 * 取得当前用户, 返回值为SpringSecurity的User类或其子类, 如果当前用户未登录则返回null.
	 * 
	 * @return 用户对象
	 */
	@SuppressWarnings("unchecked")
	public static <T extends Account> T getCurrentUser() {
		Authentication authentication = getAuthentication();

		if (authentication == null) {
			return null;
		}

		Object principal = authentication.getPrincipal();
		if (!(principal instanceof Account)) {
			return null;
		}

		return (T) principal;
	}

	/**
	 * 取得Authentication, 如当前SecurityContext为空时返回null.
	 * 
	 * @return Authentication 验证对象
	 */
	public static Authentication getAuthentication() {
		SecurityContext context = SecurityContextHolder.getContext();

		if (context == null) {
			return null;
		}

		return context.getAuthentication();
	}
}
