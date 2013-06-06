package cn.sdh.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import cn.sdh.common.base.HibernateDaoImpl;
import cn.sdh.common.base.QueryParamEntity;
import cn.sdh.entity.Role;

@Repository
public class RoleDao extends HibernateDaoImpl<Role> {
	
	/***
	 * 根据编号查询角色
	 * @param userid
	 * @return
	 */
	public Role findRoleById(Long id){
		
		return getEntityById(id);
	}
	
	/***
	 * 查询角色列表
	 * @param userid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<Role> queryRoles(Role entity){
		Map<String, QueryParamEntity> querymap = new HashMap<String, QueryParamEntity>();
		querymap.put("roleName", new QueryParamEntity("like","","%"));
		querymap.put("id", new QueryParamEntity("=","",""));
		
		Map<String, Object> params  = getSearchParams(entity,querymap);
		
		return queryListByHql(params.get("listHql")+"", params);
	}
	
	

}
