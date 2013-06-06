package cn.sdh.audit;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

/**
 * 自定义访问决定器 控制用户能否访问该链接
 * @author sun
 *
 */
public class MyAccessDecisionManager implements AccessDecisionManager {

	
	public void decide(Authentication authentication, Object object,
			Collection<ConfigAttribute> configAttributes)
			throws AccessDeniedException, InsufficientAuthenticationException {
		
		//如果访问的页面没有权限限制 那么不做拦截继续访问 如果未空说明该页面不需要任何角色
		// 注意这里的configAttributes 其实就是MyFilterInvocationSecurityMetadataSource返回的 
		if (configAttributes == null) {
			return;
		}
		
		//如果有权限限制 那么需要迭代权限 验证用户所拥有的权限是否包含 当前页面的访问权限
		Iterator<ConfigAttribute> ite = configAttributes.iterator();
		while (ite.hasNext()) {
			
			//获取访问页面需要的权限
			ConfigAttribute ca = ite.next();
			
			//获取访问页面需要的权限的权限名称
			String needRole = ((SecurityConfig) ca).getAttribute();
			
			//迭代用户所拥有的权限
			for (GrantedAuthority ga : authentication.getAuthorities()) {
				//如果用户的其中一个权限满足 访问链接需要的其中一个权限,那么访问将继续
				if (needRole.equals(ga.getAuthority())) {
					return;
				}
			}
		}
		//否则 访问将被终止
		throw new AccessDeniedException("没有权限访问");
	}

	public boolean supports(ConfigAttribute attribute) {
		// TODO Auto-generated method stub
		return true;
	}

	public boolean supports(Class<?> clazz) {
		// TODO Auto-generated method stub
		return true;
	}

	

}
