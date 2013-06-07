package cn.sdh.service;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.sdh.common.Constants;
import cn.sdh.common.Page;
import cn.sdh.common.base.BaseService;
import cn.sdh.common.exception.ServiceException;
import cn.sdh.common.listener.ActiveUserListener;
import cn.sdh.dao.AccountDao;
import cn.sdh.entity.Account;

@Transactional
@Service
public class AccountService extends BaseService{
	@Autowired
	private AccountDao accountDao;
	
	/**
	 * 查询用户列表
	 * @param page
	 * @return
	 * @throws ServiceException
	 */
	public List<Account> query(Page page,Account entity) throws ServiceException{
		
		List<Account> list = new ArrayList<Account>();
		
		try {
			list = accountDao.queryAccount(page,entity);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
		
		return list;
		
	}
	
	/**
	 * 根据用户名查找用户
	 * @param username
	 * @return
	 * @throws ServiceException
	 */
	public Account findByName(String username) throws ServiceException{
		if(username==null||"".equals("username")){
			throw new ServiceException("用户名不能为空","");
		}
		
		Account u = new Account();
		
		try {
			u = accountDao.findUserByName(username);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
		
		return u;
	}
	
	/**
	 * 批量保存用户
	 * @param list
	 * @throws ServiceException
	 */
	public void saves(List<Account> list) throws ServiceException{
		try {
			accountDao.saveList(list);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
	}
	
	/**
	 * 保存单一用户
	 * @param entity
	 * @throws ServiceException
	 */
	public void save(Account entity) throws ServiceException{
		
		try {
			accountDao.save(entity);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
	}
	
	/**
	 * 批量删除用户
	 * @param ids
	 */
	public void deletes(String [] ids) throws ServiceException{
		try {
			if(ids!=null&&ids.length>0){
				for(int i = 0;i<ids.length;i++){
					accountDao.deleteById(Long.parseLong(ids[i]));
				}
			}
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
	}
	
	/**
	 * 根据id查找用户
	 * @param id
	 * @return
	 * @throws ServiceException
	 */
	public Account findById(Long id) throws ServiceException{
		Account entity = null;
		
		try {
			entity = accountDao.getEntityById(id);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP,e.getMessage());
		}
		
		return entity;
	}
	
	/**
	 * 登录日志
	 * @throws ServiceException 
	 */
	public void loginLog(String username,HttpServletRequest request){
		Account account = accountDao.findUserByName(username);
		
		//更改登录时间
		accountDao.modifyLastLoginTime(account);
		
		ActiveUserListener.putUserSession(username, request.getSession().getId());
		
	}

	@Override
	protected Logger getLogger() {
		return Logger.getLogger(AccountService.class);
	}

}
