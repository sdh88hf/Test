package cn.sdh.common.base;


/**
 * 数据层泛型接口
 * 
 * @author 孙东辉 2011-5-27
 */
public interface HibernateDao<T extends BaseEntity> {
	/**
	 * 插入数据实体
	 * 
	 * @param entity
	 *            数据实体
	 */
	void insert(T entity);

	/**
	 * 根据ID删除数据实体
	 * 
	 * @param id
	 *            主键
	 */
	void deleteById(Long id);

	/**
	 * 删除数据实体
	 * 
	 * @param entity
	 *            数据实体
	 */
	void delete(T entity);

	/**
	 * 更新数据实体
	 * 
	 * @param entity
	 *            数据实体
	 */
	void update(T entity);

	/**
	 * 根据ID获取数据实体
	 * 
	 * @param id
	 *            主键
	 * @return 数据实体
	 */
	T getEntityById(Long id);
}
