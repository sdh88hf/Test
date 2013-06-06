package cn.sdh.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import cn.sdh.common.Page;
import cn.sdh.common.base.HibernateDaoImpl;
import cn.sdh.common.base.QueryParamEntity;
import cn.sdh.entity.Account;
import cn.sdh.entity.Role;

@Repository
public class AccountDao extends HibernateDaoImpl<Account> {
	
	@SuppressWarnings("unchecked")
	public List<Account> queryAccount(Page page,Account entity){
		Map<String, QueryParamEntity> querymap = new HashMap<String, QueryParamEntity>();
		querymap.put("username", new QueryParamEntity("like","","%"));
		querymap.put("email", new QueryParamEntity("like","%","%"));
		
		Map<String, Object> params  = getSearchParams(entity,querymap);
		
		return queryPageListByHql(page, params.get("countHql")+"", params.get("listHql")+"", params);
	}
	
	/**
	 * 根据用户名查询用户
	 * @param username
	 * @return
	 */
	public Account findUserByName(String username){
		String hql = "from Account u where u.username = :username";
		
		Map<String, String> cond = new HashMap<String, String>();
		cond.put("username", username);
		
		return (Account) queryByHql(hql, cond);
	}
	
	/***
	 * 根据用户编号查询角色列表
	 * @param userid
	 * @return
	 */
	public List<Role> queryRolesById(Long userid){
		
		List<Role> list = new ArrayList<Role>();
		
		Role r = new Role();
		r.setId(1L);
		r.setRoleName("超级管理员");
		list.add(r);
		
		return list;
	}
	
	/**
	 * 更新登录时间
	 * @param account
	 * @return
	 */
	public int modifyLastLoginTime(Account account){
		String hql = "update Account set lastLoginTime = CURRENT_TIMESTAMP() where id = :id";
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", account.getId());
		
		return batchModifyByHql(hql, params);
	}

}
