package cn.sdh.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;

import cn.sdh.common.base.AuditEntity;

@SuppressWarnings("serial")
@Entity
@Table(name="accounts")
public class Account extends AuditEntity implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_ACCOUNT")
	@SequenceGenerator(name = "SEQ_ACCOUNT", sequenceName = "SEQ_ACCOUNT", initialValue = 2, allocationSize = 1)
	@Column(name="id")
	private Long id;
	
	@Column(name="username")
	private String username;
	
	@Column(name="password")
	private String password;
	
	@Column(name="email")
	private String email;
	
	//@Type(type="cn.sdh.common.userType.dateToInt")
	@Column(name="lastlogintime")
	private Date lastLoginTime;
	
	private int userType;//用户类型-1:超级管理员 0普通用户 1+级用户
	
	//搜索时间 起止
	@Transient
	private Date lastLoginTime1;
	
	@Transient
	private Date lastLoginTime2;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="account_role",joinColumns={@JoinColumn(name="accountid")},inverseJoinColumns={@JoinColumn(name="roleid")})
	private List<Role> roles = new ArrayList<Role>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	/**
	 * 告诉spring当前用户的角色
	 */
	@Override
	public Collection<GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> authSet = new HashSet<GrantedAuthority>();
		for (Role role : this.getRoles()) {
			authSet.add(new GrantedAuthorityImpl(role.getId().toString()));
		}
		return authSet;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public Date getLastLoginTime1() {
		return lastLoginTime1;
	}

	public void setLastLoginTime1(Date lastLoginTime1) {
		this.lastLoginTime1 = lastLoginTime1;
	}

	public Date getLastLoginTime2() {
		return lastLoginTime2;
	}

	public void setLastLoginTime2(Date lastLoginTime2) {
		this.lastLoginTime2 = lastLoginTime2;
	}

	public int getUserType() {
		return userType;
	}

	public void setUserType(int userType) {
		this.userType = userType;
	}
	
	public List<Permission> getSignPer(){
		
		List<Permission> perList = new ArrayList<Permission>();
		
		for(Role role : this.getRoles()){
			List<Permission> sublist = role.getPermissionList();
			
			for(int h = 0; h<sublist.size(); h++){
				boolean continueFlag = false;
				
				for(int j = 0;j<perList.size();j++){
					if(role.getPermissionList().get(h).getId()==perList.get(j).getId()){
						continueFlag = true;
						
						break;
					}
					
				}
				
				if(continueFlag){
					continue;
				}
				if(role.getPermissionList().get(h).getLevel()==2){
					role.getPermissionList().get(h).setLeaf(1);
				}
				role.getPermissionList().get(h).setChildren(null);
				//role.getPermissionList().get(h).setControlType(role.getPermissionList().get(h).getControlType());
				perList.add(role.getPermissionList().get(h));
			}
			
		}
		
		return perList;
	}

}
