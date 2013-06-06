package cn.sdh.common.userType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Date;

import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.usertype.UserType;

/**
 * 类型转换
 * 
 * @author 孙东辉 2011-5-27
 */
public class dateToInt implements UserType {

	@Override
	public Object assemble(Serializable arg0, Object arg1)
			throws HibernateException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object deepCopy(Object arg0) throws HibernateException {
		System.out.println("in1...");
		return 0;
	}

	@Override
	public Serializable disassemble(Object arg0) throws HibernateException {
		System.out.println("in2..");
		return null;
	}

	@Override
	public boolean equals(Object arg0, Object arg1) throws HibernateException {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode(Object arg0) throws HibernateException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean isMutable() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Object nullSafeGet(ResultSet rs, String[] names, Object arg2)
			throws HibernateException, SQLException {
		Date value=(Date)Hibernate.DATE.nullSafeGet(rs, names[0]);
        if (value!=null) {
            return parse(value);
        }else {
            return null;
        }
	}
	
	 private Long parse(Date value){
        if(value==null){
        	return null;
        }
		 
        return value.getTime();
    }

	@Override
	public void nullSafeSet(PreparedStatement ps, Object value, int index)
			throws HibernateException, SQLException {
		if(value!=null){
            Long val= (Long) value;
            
            Date d = new Date(val);
            //保存数据
            Hibernate.DATE.nullSafeSet(ps, d,index);
        }else {
            //空值就直接保存了
            Hibernate.DATE.nullSafeSet(ps,null,index);
        }
		
	}

	@Override
	public Object replace(Object arg0, Object arg1, Object arg2)
			throws HibernateException {
		System.out.println("in4..");
		return null;
	}

	@Override
	public Class returnedClass() {
		System.out.println("in5..");
		return null;
	}

	@Override
	public int[] sqlTypes() {
		return new int[]{Types.TIMESTAMP};
	}
	
	
}
