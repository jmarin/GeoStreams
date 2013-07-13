package org.geostreams.core

import akka.actor.{ActorSystem, Props}
import org.geostreams.master._


trait Core {
	implicit def system: ActorSystem
}

trait BootCore extends Core {
	implicit lazy val system = ActorSystem("geostreams")

	/**
	* Ensure ActorSystem is shutdown when JVM shuts down
	*/

	sys.addShutdownHook(system.shutdown)

}

/**
 * This trait contains the actors that make up our application; it can be mixed\
 in with
 * ``BootedCore`` for running code or ``TestKit`` for unit and integration test\
s.
 */
trait CoreActors {
	//import org.geostreams._

	this: Core =>

	val masterActor = system.actorOf(Props[MasterActor])
}