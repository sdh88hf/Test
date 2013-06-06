package cn.sdh.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import cn.sdh.dao.AccountDao;
import cn.sdh.entity.Account;

/**
 * 认证业务类
 *
 */
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	private AccountDao dao;
	
	
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException, DataAccessException {
		
		//查找用户时候存在
		Account user = dao.findUserByName(username);
		
		if(user == null){
			
			throw new UsernameNotFoundException("用户不存在");
		}
		
		return user;
	}

}
