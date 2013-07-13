import akka.testkit.TestKitBase
import akka.testkit.TestActorRef
import akka.actor._
import akka.pattern.ask
import scala.concurrent.Await
import scala.concurrent.duration._
import akka.testkit.{ TestKit, TestActorRef, DefaultTimeout, ImplicitSender }
import org.scalatest.matchers.ShouldMatchers
import org.scalatest.{ WordSpec, BeforeAndAfterAll }

class TestSpec extends TestKit(ActorSystem("TestSpec"))
  with DefaultTimeout with ImplicitSender
  with WordSpec with ShouldMatchers with BeforeAndAfterAll {

  import TestSpec._

  "A simple actor " should {
    val echoRef = TestActorRef[EchoActor]
    "reply with message sent" in {
      echoRef ! "hello world"
      expectMsg("hello world")
    }
  }

}

object TestSpec {
  
  class EchoActor extends Actor {

    def receive = {
      case msg: String => {
        sender ! msg
      }
    }
  }
}