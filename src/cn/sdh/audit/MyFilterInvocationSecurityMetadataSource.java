package cn.sdh.audit;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Service;

import cn.sdh.common.exception.ServiceException;
import cn.sdh.entity.Permission;
import cn.sdh.service.RoleService;
import cn.sdh.utils.MyCacheUtil;

/**
 * 当前访问链接 需要什么权限 在这边定义
 * @author 孙东辉
 *
 */
@Service
public class MyFilterInvocationSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {
	
	@Autowired
	private RoleService roleService;
	
	public Collection<ConfigAttribute> getAttributes(Object object)
			throws IllegalArgumentException {
		
		//这个是当前访问的链接 实际开发中我们会去数据库查找访问该链接的需要哪些权限(也称角色)
		String requestUrl = ((FilterInvocation) object).getRequestUrl();
		
		//如果访问的是主页 不需要任何权限
		if(requestUrl.indexOf("account!index.action")>=0||requestUrl.indexOf("index.jsp")>=0||requestUrl.indexOf("permission!queryBtnListByControlType.action")>=0){
			return null;
		}
		
		// 对于带参数的请求,截取?前面的uri
		int urlIndex = requestUrl.indexOf("?");

		if (urlIndex != -1) {
			requestUrl = requestUrl.substring(0, urlIndex);
		}
		
		//如果第一位是/ 去掉
		if(requestUrl.startsWith("/")){
			requestUrl = requestUrl.substring(1);
		}
		
		if(MyCacheUtil.roles.size()==0){//如果缓存中没有
			
			try {
				MyCacheUtil.roles = roleService.query();
			} catch (ServiceException e) {
				throw new IllegalArgumentException(e.getMsg());
			}
		}
		
		Collection<ConfigAttribute> c = new HashSet<ConfigAttribute>();
		
		List<Permission> permissionList = null;
		if(MyCacheUtil.roles.size()>0){
			for(int i = 0;i<MyCacheUtil.roles.size();i++){
				permissionList = MyCacheUtil.roles.get(i).getPermissionList();
				
				for(int j = 0;j<permissionList.size();j++){
					//因为一个操作可能需要多个连接权限
					if(permissionList.get(j)!=null&&permissionList.get(j).getActionUrl()!=null&&permissionList.get(j).getActionUrl().indexOf(requestUrl)>=0){
						ConfigAttribute configAttribute = new SecurityConfig(MyCacheUtil.roles.get(i).getId()+"");
						c.add(configAttribute);
						break;
					}
				}
				
			}
		}else{
			return null;
		}
		
		return c;
	}

	public Collection<ConfigAttribute> getAllConfigAttributes() {
		
		System.out.println("getAllConfigAttributes...");
		
		return null;
	}

	public boolean supports(Class<?> clazz) {
		
		System.out.println(clazz.getName());
		
		return true;
	}
	
}
