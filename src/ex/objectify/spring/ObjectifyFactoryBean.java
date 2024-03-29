package ex.objectify.spring;

import org.springframework.beans.factory.FactoryBean;

import com.googlecode.objectify.Objectify;

public class ObjectifyFactoryBean implements FactoryBean<Objectify> {

	private ObjectifyManager manager;

	@Override
	public Objectify getObject() throws Exception {
		return manager.getProxy();
	}

	@Override
	public Class<?> getObjectType() {
		return Objectify.class;
	}

	@Override
	public boolean isSingleton() {
		return false;
	}

	public void setManager(ObjectifyManager manager) {
		this.manager = manager;
	}

}