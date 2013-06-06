package cn.sdh.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import cn.sdh.common.base.HibernateDaoImpl;
import cn.sdh.entity.Permission;

@Repository
public class PermissionDao extends HibernateDaoImpl<Permission> {
	
	/*
	 * 根据名称查询所有子集
	 */
	@SuppressWarnings("unchecked")
	public List<Permission> querySubByName(String name){
		String queryHql = "from Permission p where exists(select p2.id from Permission p2 where name=:name and p.parentid = p2.id)";
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("name", name);
		
		return queryListByHql(queryHql, params);
	}
	
	public List<Permission> queryByRoleId(){
		String hql = this.LIST_HQL+" and level = 1 order by id";
		
		return queryListByHql(hql, new HashMap<String, Object>());
	}

}
