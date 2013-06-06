package cn.sdh.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;

import cn.sdh.common.CheckTree;
import cn.sdh.common.Page;
import cn.sdh.common.base.JsonBaseAction;
import cn.sdh.common.exception.ServiceException;
import cn.sdh.entity.Permission;
import cn.sdh.service.PermissionService;

@Namespace("/")
@SuppressWarnings("serial")
@Action(results={@Result(name="checktree",type="json",params={"root","searchList"})})
public class PermissionAction extends JsonBaseAction<Permission> {
	@Autowired
	private PermissionService permissionService;
	
	private List<CheckTree> checkTreeList = new ArrayList<CheckTree>();
	
	/**
	 * 根据name获取子项
	 */
	public String querySubByName(){
		try {
			searchList = permissionService.querySubByName(entity.getName());
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
		
		return JSON;
	}
	
	@Override
	public void searchList(Page page) {
		
//		try {
//			//searchList = permissionService.query(page);
//		} catch (ServiceException e) {
//			this.putResult(false, e.getMsg());
//		}
		
	}

	@Override
	public void searchEntity() {
//		try {
//			entity = accountService.findByName(entity.getUsername());
//		} catch (ServiceException e) {
//			this.putResult(false, e.getMsg());
//		}
	}

	@Override
	public void deleteEntity() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void addOrUpdEntity() {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * 根据控件名称获取当前用户的按钮集合
	 * @return
	 */
	public String queryBtnListByControlType(){
		try {
			searchList = permissionService.querySubByControlType(entity.getControlType());
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
		
		return JSON;
	}
	
	public void digui(List<Permission> list){
		for(int i = 0;i<list.size();i++){
			list.get(i).setExpanded(true);
			if(list.get(i).getChildren()!=null&&list.get(i).getChildren().size()>0){
				list.get(i).setLeaf(0);
				digui(list.get(i).getChildren());
			}
			
		}
	}
	
	public String queryByRoleId(){
		try {
			searchList = permissionService.queryByRoleId(entity.getId());
			
			
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
		
		return "checktree";
	}
	
	@Override
	public void setEntity() {
		entity = new Permission();
	}

	public List<CheckTree> getCheckTreeList() {
		return checkTreeList;
	}

	public void setCheckTreeList(List<CheckTree> checkTreeList) {
		this.checkTreeList = checkTreeList;
	}

}
