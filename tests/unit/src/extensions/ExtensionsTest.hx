package extensions;

import utest.Assert;
import hx.injection.Service;
import hx.injection.ServiceCollection;
using hx.injection.ServiceExtensions;

enum abstract Response(Int)
{
	public var Ok = 123;
}

abstract class AbstractBase implements Service
{
	public abstract function Start():Response;
}

class SomeClass extends AbstractBase
{
	public function new() {}

	public function Start():Response
	{
		return Response.Ok;
	}
}

final class ExtensionsTest extends utest.Test 
{
	public function testMain()
	{
		var collection:ServiceCollection = new ServiceCollection();
		collection.addSingleton(AbstractBase, SomeClass);
		Assert.equals(Response.Ok, collection.createProvider().getService(AbstractBase).Start());
	}
}