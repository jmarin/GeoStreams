package org.geostreams.master

import akka.actor._

class MasterActor extends Actor {

	def receive = {
		case _ => println("no message")
	}
}