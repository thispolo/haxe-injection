package extensions;

import utest.Assert;
import hx.injection.Service;
import hx.injection.ServiceCollection;
import hx.injection.ServiceType;

// comment this when using version 2.1.0
using hx.injection.ServiceExtensions;
// ------------------------------------------------------------

enum abstract ServiceStatus(Int)
{
	public var Ok = 123;
}

enum abstract ServiceBaseErrCodes(Int)
{
	public var OK = 0;
}

interface IService extends Service
{
	public function Start():ServiceStatus;
	public function Pause():ServiceStatus;
	public function Stop():ServiceStatus;
}

interface IServiceBase<TServiceErrCodeEnum> extends IService
{
	public var TargetState(default, null):ServiceStatus;
	public var CurrentState(default, null):ServiceStatus;
	public var ErrCode(default, null):TServiceErrCodeEnum;
}

interface INodeBase<TServiceErrCodeEnum> extends IServiceBase<TServiceErrCodeEnum> {}

abstract class NodeBase<ServiceErrCodeEnum> implements INodeBase<ServiceErrCodeEnum>
{
	public var Status(default, null):ServiceStatus;
	public var ErrCode(default, null):ServiceErrCodeEnum;

	public abstract function Start():ServiceStatus;

	public abstract function Pause():ServiceStatus;

	public abstract function Stop():ServiceStatus;

	public abstract function SendMessage(message:String):Bool;
}

class Node extends NodeBase<ServiceBaseErrCodes>
{
	public function new() {}

	public function Start():ServiceStatus
	{
		return ServiceStatus.Ok;
	}

	public function Pause():ServiceStatus
	{
		return ServiceStatus.Ok;
	}

	public function Stop():ServiceStatus
	{
		return ServiceStatus.Ok;
	}

	public function SendMessage(message:String):Bool
	{
		return true;
	}
}

final class ExtensionsTest extends utest.Test 
{
	public function testMain()
	{
		var collection:ServiceCollection = new ServiceCollection();
		collection.addSingleton(IService, Node);
		Assert.equals(ServiceStatus.Ok, collection.createProvider().getService(IService).Start());
	}
}