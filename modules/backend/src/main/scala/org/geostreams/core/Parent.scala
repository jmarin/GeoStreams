package org.geostreams.core

import java.util.Date
import akka.actor._


object ParentActor {
	case class Ping
	case class Pong(reply:String, date:Date)
	case class Register(processor:ActorRef)
	case object Registered
	case object NotRegistered
}

class ParentActor extends Actor {
	import ParentActor._

	def receive = {
		case Ping => sender ! Pong("OK", new Date())
		case Register(processor) =>
		case Registered =>
		case NotRegistered => 
	}
}