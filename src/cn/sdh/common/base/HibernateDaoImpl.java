package cn.sdh.common.base;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import cn.sdh.common.Page;

public class HibernateDaoImpl<T extends BaseEntity> extends HibernateDaoSupport
		implements HibernateDao<T> {

	protected final String COUNT_HQL = "select count(id) ";
	
	protected final String LIST_HQL;
	
	/**
	 * 数据实体类型
	 */
	protected Class<T> entityClass;

	/**
	 * 默认构造函数
	 */
	@SuppressWarnings("unchecked")
	public HibernateDaoImpl() {
		Type superClassType = getClass().getGenericSuperclass();

		if (superClassType instanceof ParameterizedType) {
			Type[] paramTypes = ((ParameterizedType) superClassType)
					.getActualTypeArguments();
			this.entityClass = (Class<T>) paramTypes[0];
		}
		
		LIST_HQL = "from " + this.entityClass.getSimpleName() + " where 1=1";
	}

	/**
	 * 新增或更新
	 */
	@Override
	public void insert(T entity) {
		getHibernateTemplate().merge(entity);
	}

	/**
	 * 新增
	 * 
	 * @param entity
	 */
	public void save(T entity) {
		if(entity!=null&&entity.getId()!=null){
			insert(entity);
		}else if(entity!=null){
			getHibernateTemplate().save(entity);
		}
	}
	
	public void saveList(List<T> list){
		if(list!=null&&list.size()>0){
			for(int i = 0;i<list.size();i++){
				if(list.get(i).getId()!=null){
					this.save(list.get(i));
				}else{
					this.insert(list.get(i));
				}
			}
			
		}
	}

	/**
	 * 删除
	 */
	@Override
	public void deleteById(Long id) {
		this.delete(this.getEntityById(id));
	}

	/**
	 * 指定需要删除的实体
	 * 
	 * @param entityClass
	 *            实体对象
	 * @param id
	 *            主键ID
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void deleteById(Class entityClass, Long id) {
		this.delete((T) this.getEntityById(entityClass, id));
	}

	@Override
	public void delete(T entity) {
		getHibernateTemplate().delete(entity);
	}

	/**
	 * 更新并添加更新时间
	 */
	@Override
	public void update(T entity) {
		if (entity instanceof AuditEntity) {
			((AuditEntity) entity).setUpdateDate(new Date());
		}
		getHibernateTemplate().update(entity);
	}

	/**
	 * 根据id获取明细
	 */
	@SuppressWarnings("unchecked")
	@Override
	public T getEntityById(Long id) {
		return (T) this.getEntityById(this.entityClass, id);
	}

	/**
	 * 根据主键ID取得实体对象
	 * 
	 * @param entityClass
	 *            实体类
	 * @param id
	 *            主键ID
	 * @return 取得的实体对象
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Object getEntityById(Class entityClass, Long id) {
		return getHibernateTemplate().get(entityClass, id);
	}

	/**
	 * 使用Criteria方式取得实体对象
	 * 
	 * @param entityClass
	 *            实体类
	 * @param criterions
	 *            表达式
	 * @return 实体对象
	 */
	@SuppressWarnings("rawtypes")
	public Object queryByCriteria(Class entityClass, Criterion... criterions) {
		return this.queryEntityByCriteria(entityClass, null, criterions);
	}

	/**
	 * 是否使用锁定模式，使用Criteria方式取得实体对象
	 * 
	 * @param entityClass
	 *            实体对象
	 * @param lockMode
	 *            行级锁定
	 * @param criterions
	 *            表达式
	 * @return 实体对象
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object queryEntityByCriteria(final Class entityClass,
			final LockMode lockMode, final Criterion... criterions) {
		return getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createCriteria(session, entityClass, lockMode,
						criterions).uniqueResult();
			}
		});
	}

	/**
	 * 取得Criteria对象
	 * 
	 * @param session
	 *            hibernate会话
	 * @param entityClass
	 *            实体类
	 * @param lockMode
	 *            是否行级锁定
	 * @param criterions
	 *            表达式
	 * @return Criteria
	 */
	@SuppressWarnings("rawtypes")
	private Criteria createCriteria(Session session, Class entityClass,
			LockMode lockMode, Criterion... criterions) {
		Criteria criteria = session.createCriteria(entityClass);

		if (lockMode != null) {
			criteria.setLockMode(lockMode);
		}

		if (criteria != null) {
			for (Criterion criterion : criterions) {
				criteria.add(criterion);
			}
		}

		return criteria;
	}

	/**
	 * 根据hql语句查询
	 * 
	 * @param hql
	 * @param conditions
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object queryByHql(final String hql, final Object... conditions) {
		return getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createQuery(session, hql, conditions).uniqueResult();
			}
		});
	}

	/**
	 * 通过HQL方式查询对象
	 * 
	 * @param hql
	 *            HQL
	 * @param conditions
	 *            条件
	 * @return 查询结果
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object queryByHql(final String hql, final Map<String, ?> conditions) {
		return getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createQuery(session, hql, conditions).uniqueResult();
			}
		});
	}

	/**
	 * 通过HQL方式查询列表
	 * 
	 * @param hql
	 *            HQL
	 * @param conditions
	 *            条件
	 * @return 查询结果
	 */
	@SuppressWarnings("rawtypes")
	public List queryListByHql(final String hql, final Object... conditions) {
		return getHibernateTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createQuery(session, hql, conditions).list();
			}
		});
	}

	/**
	 * 通过HQL方式查询列表
	 * 
	 * @param hql
	 *            HQL
	 * @param conditions
	 *            条件
	 * @return 查询结果
	 */
	@SuppressWarnings("rawtypes")
	public List queryListByHql(final String hql, final Map<String, ?> conditions) {
		return getHibernateTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createQuery(session, hql, conditions).list();
			}
		});
	}

	/**
	 * 通过HQL方式查询分页列表
	 * 
	 * @param page
	 *            分页
	 * @param countHql
	 *            总数HQL
	 * @param queryHql
	 *            查询HQL
	 * @param conditions
	 *            条件
	 * @return 分页列表
	 */
	@SuppressWarnings({ "rawtypes" })
	public List queryPageListByHql(final Page page, final String countHql,
			final String queryHql, final Object... conditions) {
		long count = (Long) this.queryByHql(countHql, conditions);
		page.setCount(count);
		List list = null;

		if (count > 0) {
			list = getHibernateTemplate().executeFind(new HibernateCallback() {
				public Object doInHibernate(Session session)
						throws HibernateException, SQLException {
					Query query = createQuery(session, queryHql, conditions);
					query.setFirstResult(page.getIndex());
					query.setMaxResults(page.getPageSize());
					return query.list();
				}
			});
		}

		return list;
	}

	/**
	 * 通过HQL方式查询分页列表
	 * 
	 * @param page
	 *            分页
	 * @param countHql
	 *            总数HQL
	 * @param queryHql
	 *            查询HQL
	 * @param conditions
	 *            条件
	 * @return 分页列表
	 */
	@SuppressWarnings({ "rawtypes" })
	public List queryPageListByHql(final Page page, final String countHql,
			final String queryHql, final Map<String, ?> conditions) {

		long count = (Long) this.queryByHql(countHql, conditions);
		page.setCount(count);
		List list = null;

		if (count > 0) {
			list = getHibernateTemplate().executeFind(new HibernateCallback() {
				public Object doInHibernate(Session session)
						throws HibernateException, SQLException {
					Query query = createQuery(session, queryHql, conditions);
					query.setFirstResult(page.getIndex());
					query.setMaxResults(page.getPageSize());
					return query.list();
				}
			});
		}

		return list;
	}

	// @SuppressWarnings({ "unchecked", "rawtypes" })
	// public JsonPage queryJsonPageByHql(final JsonPage page,
	// final String countHql, final String queryHql,
	// final Map<String, ?> conditions) {
	// long count = (Long) this.queryByHql(countHql, conditions);
	// page.setCount(count);
	// List list = null;
	//
	// if (count > 0) {
	// list = getHibernateTemplate().executeFind(new HibernateCallback() {
	// public Object doInHibernate(Session session)
	// throws HibernateException, SQLException {
	// Query query = createQuery(session, queryHql, conditions);
	// query.setFirstResult(page.getIndex());
	// query.setMaxResults(page.getPageSize());
	// return query.list();
	// }
	// });
	// }
	//
	// page.setGridModel(list);
	//
	// return page;
	// }

	/**
	 * 通过HQL批量修改或删除
	 * 
	 * @param hql
	 *            HQL
	 * @param conditions
	 *            条件
	 * @return 修改或删除数量
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int batchModifyByHql(final String hql,
			final Map<String, ?> conditions) {
		return (Integer) getHibernateTemplate().execute(
				new HibernateCallback() {
					public Object doInHibernate(Session session)
							throws HibernateException, SQLException {
						return createQuery(session, hql, conditions)
								.executeUpdate();
					}
				});
	}

	/**
	 * 创建HQL查询
	 * 
	 * @param session
	 *            会话
	 * @param hql
	 *            HQL
	 * @param conditions
	 *            条件
	 * @return 查询对象
	 */
	private Query createQuery(Session session, String hql, Object... conditions) {
		Query query = session.createQuery(hql);

		if (conditions != null) {
			for (int i = 0; i < conditions.length; i++) {
				query.setParameter(i, conditions[i]);
			}
		}

		return query;
	}

	/**
	 * 创建HQL查询
	 * 
	 * @param session
	 *            会话
	 * @param hql
	 *            HQL
	 * @param conditions
	 *            条件
	 * @return 查询对象
	 */
	private Query createQuery(Session session, String hql,
			Map<String, ?> conditions) {
		Query query = session.createQuery(hql);

		if (conditions != null) {
			query.setProperties(conditions);
		}

		return query;
	}

	/**
	 * 通过SQL方式查询对象
	 * 
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体
	 */
	public Object queryBySqlMap(String sql, Map<String, ?> conditions) {
		return this.queryBySqlMap(null, sql, conditions);
	}

	/**
	 * 通过SQL方式查询对象
	 * 
	 * @param entityClass
	 *            数据实体类型
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object queryBySqlMap(final Class entityClass, final String sql,
			final Map<String, ?> conditions) {
		return getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createSqlQuery(session, entityClass, sql, conditions)
						.uniqueResult();
			}
		});
	}

	/**
	 * TODO：这个方法需要测试下
	 * 
	 * 通过SQL方式查询分页列表
	 * 
	 * @param page
	 *            分页
	 * @param entityClass
	 *            数据实体类型
	 * @param countSql
	 *            总数SQL
	 * @param querySql
	 *            查询SQL
	 * @param conditions
	 *            条件
	 * @return 分页列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryPageListBySqlMap(final Page page, final Class entityClass,
			final String countSql, final String querySql,
			final Map<String, Object> conditions) {

		long count = ((BigDecimal) this.queryBySqlMap(countSql, conditions))
				.longValue();

		page.setCount(count);
		List list = null;

		if (count > 0) {
			list = getHibernateTemplate().executeFind(new HibernateCallback() {
				public Object doInHibernate(Session session)
						throws HibernateException, SQLException {
					Query query = createSqlQuery(session, null, querySql,
							conditions);

					return query.list();

				}
			});
		}

		return list;
	}

	/**
	 * 通过SQL方式查询对象
	 * 
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体
	 */
	public Object queryBySql(String sql, Object... conditions) {
		return this.queryBySql(null, sql, conditions);
	}

	/**
	 * 通过SQL方式查询对象
	 * 
	 * @param entityClass
	 *            数据实体类型
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object queryBySql(final Class entityClass, final String sql,
			final Object... conditions) {
		return getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createSqlQuery(session, entityClass, sql, conditions)
						.uniqueResult();
			}
		});
	}

	/**
	 * 通过SQL方式查询列表
	 * 
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryListBySql(String sql, Object... conditions) {
		return this.queryListBySql(null, sql, conditions);
	}

	/**
	 * 通过SQL方式查询列表
	 * 
	 * @param entityClass
	 *            数据实体类型
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryListBySql(final Class entityClass, final String sql,
			final Object... conditions) {
		return getHibernateTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createSqlQuery(session, entityClass, sql, conditions)
						.list();
			}
		});
	}

	/**
	 * 通过SQL方式查询列表
	 * 
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryListBySql(String sql, Map<String, ?> conditions) {
		return this.queryListBySql(null, sql, conditions);
	}

	/**
	 * 通过SQL方式查询列表
	 * 
	 * @param entityClass
	 *            数据实体类型
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 数据实体列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryListBySql(final Class entityClass, final String sql,
			final Map<String, ?> conditions) {
		return getHibernateTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				return createSqlQuery(session, entityClass, sql, conditions)
						.list();
			}
		});
	}

	/**
	 * TODO：这个方法需要测试下 sunwen
	 * 
	 * 通过SQL方式查询分页列表
	 * 
	 * @param page
	 *            分页
	 * @param entityClass
	 *            数据实体类型
	 * @param countSql
	 *            总数SQL
	 * @param querySql
	 *            查询SQL
	 * @param conditions
	 *            条件
	 * @return 分页列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryPageListBySql(final Page page, final Class entityClass,
			final String countSql, final String querySql,
			final Map<String, ?> conditions) {
		long count = (Long) this.queryBySql(countSql, conditions);
		page.setCount(count);
		List list = null;

		if (count > 0) {
			list = getHibernateTemplate().executeFind(new HibernateCallback() {
				public Object doInHibernate(Session session)
						throws HibernateException, SQLException {
					Query query = createSqlQuery(session, entityClass,
							querySql, conditions);
					query.setFirstResult(page.getIndex());
					query.setMaxResults(page.getPageSize());
					return query.list();
				}
			});
		}

		return list;
	}

	/**
	 * 通过SQL方式查询分页列表
	 * 
	 * @param page
	 *            分页
	 * @param entityClass
	 *            数据实体类型
	 * @param countSql
	 *            总数SQL
	 * @param querySql
	 *            查询SQL
	 * @param conditions
	 *            条件
	 * @return 分页列表
	 */
	@SuppressWarnings("rawtypes")
	public List queryPageListBySql(final Page page, final Class entityClass,
			final String countSql, final String querySql,
			final Object... conditions) {
		long count = (Long) this.queryBySql(countSql, conditions);
		page.setCount(count);
		List list = null;

		if (count > 0) {
			list = getHibernateTemplate().executeFind(new HibernateCallback() {
				public Object doInHibernate(Session session)
						throws HibernateException, SQLException {
					Query query = createSqlQuery(session, entityClass,
							querySql, conditions);
					query.setFirstResult(page.getIndex());
					query.setMaxResults(page.getPageSize());
					return query.list();
				}
			});
		}

		return list;
	}

	/**
	 * 通过SQL批量修改或删除
	 * 
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 修改或删除数量
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int batchModifyBySql(final String sql, final Object... conditions) {
		return (Integer) getHibernateTemplate().execute(
				new HibernateCallback() {
					public Object doInHibernate(Session session)
							throws HibernateException, SQLException {
						return createSqlQuery(session, null, sql, conditions)
								.executeUpdate();
					}
				});
	}

	/**
	 * 创建SQL查询
	 * 
	 * @param session
	 *            会话
	 * @param entityClass
	 *            数据实体类型
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 查询对象
	 */
	@SuppressWarnings("rawtypes")
	private SQLQuery createSqlQuery(Session session, Class entityClass,
			String sql, Object... conditions) {
		SQLQuery sqlQuery = session.createSQLQuery(sql);

		if (entityClass != null) {
			sqlQuery.addEntity(entityClass);
		}

		if (conditions != null) {
			for (int i = 0; i < conditions.length; i++) {
				sqlQuery.setParameter(i, conditions[i]);
			}
		}

		return sqlQuery;
	}

	/**
	 * 创建SQL查询
	 * 
	 * @param session
	 *            会话
	 * @param entityClass
	 *            数据实体类型
	 * @param sql
	 *            SQL
	 * @param conditions
	 *            条件
	 * @return 查询对象
	 */
	@SuppressWarnings("rawtypes")
	private SQLQuery createSqlQuery(Session session, Class entityClass,
			String sql, Map<String, ?> conditions) {
		SQLQuery sqlQuery = session.createSQLQuery(sql);

		if (entityClass != null) {
			sqlQuery.addEntity(entityClass);
		}

		if (conditions != null) {
			sqlQuery.setProperties(conditions);
		}

		return sqlQuery;
	}

	/**
	 * 强制加载实体对象
	 * 
	 * @param entity
	 *            实体对象
	 */
	public void forceInitEntity(T entity) {
		getHibernateTemplate().initialize(entity);
	}

	/**
	 * 刷新实体对象
	 * 
	 * @param entity
	 *            实体对象
	 */
	public void flush(T entity) {
		getHibernateTemplate().flush();
	}
	
	public Map<String, Object> getSearchParams(T entity,Map<String, QueryParamEntity> querymap,String...hql){
		Field[] fields = entity.getClass().getDeclaredFields();
		Map<String, Object> paramMap = new HashMap<String, Object>();
		
		StringBuilder builder = new StringBuilder("");
		
		for(int i = 0;i<fields.length;i++){
			String fieldname = fields[i].getName();
			String clazz = fields[i].getType().getName();
			
			if(clazz.indexOf("List")>=0){
				continue;
			}
			
			if(querymap.get(fieldname)==null){
				continue;
			}
			String methodname = "get"+fieldname.substring(0,1).toUpperCase()+fieldname.substring(1);
			
			try {
				Method m = entity.getClass().getMethod(methodname,new Class[]{});
				
				Object o =m.invoke(entity, new Object[]{});
				
				if(o!=null){
					if(clazz.indexOf("Long")>=0){
						if(querymap.get(fieldname).getBeforeSign()==""&&querymap.get(fieldname).getAfterSign()==""){
							paramMap.put(fieldname, Long.parseLong(querymap.get(fieldname).getBeforeSign()+o+querymap.get(fieldname).getAfterSign()));
						}
					}else{
						paramMap.put(fieldname, querymap.get(fieldname).getBeforeSign()+o+querymap.get(fieldname).getAfterSign());
					}
					
					builder.append(" and "+fieldname+" "+querymap.get(fieldname).getOptionSign()+" :"+fieldname);
				}
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		
		for(int i = 0;i<hql.length;i++){
			builder.append(hql[i]);
		}
		
		String hqlstr = builder.toString();
		
		paramMap.put("listHql", LIST_HQL + hqlstr);
		paramMap.put("countHql", COUNT_HQL+LIST_HQL + hqlstr);
		
		return paramMap;
	}

}
