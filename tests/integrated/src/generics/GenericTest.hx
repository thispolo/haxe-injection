package generics;

import hx.injection.generics.Generic;
import hx.injection.ServiceCollection;
import generics.test.*;

using hx.injection.ServiceExtensions;

final class GenericTest {
	public function new() {}

	public function run() {
		var collection = new ServiceCollection();
		collection.addSingleton(Generic.of(GenericService, SomeClass), SubService2);
		collection.addSingleton(SomeClass);
		var provider = collection.createProvider();
		var some = provider.getService(SomeClass);
		some.call();
	}
}
