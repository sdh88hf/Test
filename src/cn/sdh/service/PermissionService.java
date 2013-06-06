package cn.sdh.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.sdh.common.Constants;
import cn.sdh.common.base.BaseService;
import cn.sdh.common.exception.ServiceException;
import cn.sdh.dao.PermissionDao;
import cn.sdh.dao.RoleDao;
import cn.sdh.entity.Account;
import cn.sdh.entity.Permission;
import cn.sdh.entity.Role;
import cn.sdh.utils.SpringSecurityUtils;

@Service
public class PermissionService extends BaseService{
	@Autowired
	private PermissionDao permissionDao;
	
	private RoleDao roleDao;
	
	/**
	 * 根据name获取子集
	 * @param name
	 * @return
	 * @throws ServiceException
	 */
	public List<Permission> querySubByName(String name) throws ServiceException{
		
		List<Permission> list = new ArrayList<Permission>();
		
		try {
			list = permissionDao.querySubByName(name);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
		
		
		return list;
	}
	
	/**
	 * 获取当前用户某个控件下面的按钮权限
	 * @param type
	 * @return
	 * @throws ServiceException
	 */
	public List<Permission> querySubByControlType(String type) throws ServiceException{
		List<Permission> resultList = new ArrayList<Permission>();
		
		if(type==null){
			throwException("请明确要查找的控件",null);
		}
		
		try {
			//获取当前用户
			Account account = SpringSecurityUtils.getCurrentUser();
			
			//当前用户的角色集合
			List<Role> roleList = account.getRoles();
			
			List<Permission> perList = null;
			
			Long parentId = null;
			for(int i = 0;i<roleList.size();i++){
				perList = roleList.get(i).getPermissionList();
				boolean isbreak = false;
				for(int j = 0;j<perList.size();j++){
					if(type.equals(perList.get(j).getControlType())){
						parentId = perList.get(j).getId();
						isbreak = true;
						break;
					}
					
				}
				if(isbreak){
					break;
				}
			}
			
			if(parentId==null){
				throwException("没有找到要查找的控件",null);
			}
			
			for(int i = 0;i<roleList.size();i++){
				perList = roleList.get(i).getPermissionList();
				for(int j = 0;j<perList.size();j++){
					if(perList.get(j).getLevel()!=3){
						continue;
					}else{
						if(perList.get(j).getParentid().equals(parentId)){
							
							//是否已经包含该按钮
							boolean hasFlag = false;
							
							for(int h = 0;h<resultList.size();h++){
								if(resultList.get(h).getId()==perList.get(j).getId()){
									hasFlag = true;
									break;
								}
							}
							
							if(!hasFlag){
								resultList.add(perList.get(j));
							}
						}
						
					}
					
				}
			}
			
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
		
		return resultList;
	}
	
	public List<Permission> queryByRoleId(Long id) throws ServiceException{
		List<Permission> resultList = null;
		try {
			resultList = new ArrayList<Permission>();
			
			Account a = SpringSecurityUtils.getCurrentUser();
			
			//如果是超级用户 查所有菜单
			if(a.getUserType()==-1){
				resultList = permissionDao.queryByRoleId();
			}else{//如果不是 只获取当前用户拥有的权限
				List<Permission> signPer = a.getSignPer();
				
				for(int i = signPer.size()-1;i>=0;i--){
					for(int j = 0;j<signPer.size();j++){
						if(signPer.get(i).getId()==signPer.get(j).getId()){
							continue;
						}
						
						if(signPer.get(i).getParentid().equals(signPer.get(j).getId())){
							if(signPer.get(j).getChildren()==null){
								signPer.get(j).setChildren(new ArrayList<Permission>());
								signPer.get(j).setLeaf(0);
							}
							
							signPer.get(j).getChildren().add(signPer.get(i));
							
							signPer.remove(i);
							
							break;
						}
					}
				}
				
				resultList = signPer;
			}
			
			if(id!=null){
				
			}
			
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
		return resultList;
	}

	@Override
	protected Logger getLogger() {
		return Logger.getLogger(PermissionService.class);
	}

}
