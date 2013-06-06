package cn.sdh.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;

import cn.sdh.common.Page;
import cn.sdh.common.base.JsonBaseAction;
import cn.sdh.common.exception.ServiceException;
import cn.sdh.entity.Role;
import cn.sdh.service.RoleService;
import cn.sdh.utils.MyJsonUtil;

@Namespace("/")
@SuppressWarnings("serial")
public class RoleAction extends JsonBaseAction<Role> {
	@Autowired
	private RoleService roleService;
	
	@Override
	public void searchList(Page page) {
		try {
			searchList = roleService.query(entity);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
		
	}

	@Override
	public void searchEntity() {
		try {
			roleService.findById(entity);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
	}

	@Override
	public void deleteEntity() {
		try {
			String [] idsarr = getMsg().split(",");
			roleService.deletes(idsarr);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
	}

	@Override
	public void addOrUpdEntity() {
		List<Role> roleList = MyJsonUtil.getObjectsByJson(getMsg(), Role.class);
		
		try {
			roleService.saves(roleList);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
	}
	
	/**
	 * 保存角色拥有的权限
	 * @return
	 */
	public String saveRolePermission(){
		try {
			roleService.saveRolePermission(entity.getId(), getMsg());
			
			this.putResult(true, "保存成功");
		} catch (ServiceException e){
			this.putResult(false, e.getMsg());
		}
		return JSON;
	}
	
	@Override
	public void setEntity() {
		entity = new Role();
	}

}
