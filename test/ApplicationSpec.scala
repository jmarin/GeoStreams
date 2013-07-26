package test

import org.specs2.mutable._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json._

/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
class ApplicationSpec extends Specification {

  "Application" should {

    "send 404 on a bad request" in {
      running(FakeApplication()) {
        route(FakeRequest(GET, "/boum")) must beNone
      }
    }

    "render the index page" in {
      running(FakeApplication()) {
        val home = route(FakeRequest(GET, "/")).get

        status(home) must equalTo(OK)
        contentType(home) must beSome.which(_ == "text/html")
        contentAsString(home) must contain("Your new application is ready.")
      }
    }
  }

  "authenticate when user == password" in {
    running(FakeApplication()) {

      val json = Json.obj(
        "name" -> JsString("juan"),
        "password" -> JsString("juan"))

      val req =
        FakeRequest(
          POST,
          "/api/login",
          FakeHeaders(Seq("Content-Type" -> Seq("application/json"))),
          json)
      val result = route(req).get
      println(contentAsString(result))
      status(result) must equalTo(OK)

    }
  }

  "fail authentication when user != password" in {
    running(FakeApplication()) {
      val json = Json.obj(
        "name" -> JsString("juan"),
        "password" -> JsString("juan1"))

      val req =
        FakeRequest(
          POST,
          "/api/login",
          FakeHeaders(Seq("Content-Type" -> Seq("application/json"))),
          json)
      val result = route(req).get
      //println(contentAsString(result))
      status(result) must equalTo(UNAUTHORIZED)

    }
  }

}