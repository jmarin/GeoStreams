package controllers

import play.api._
import play.api.mvc._
import play.api.libs._
import play.api.libs.json._
import Security._

trait Security {
  case class Credentials(name: String, password: String)
  val badToken = Json.obj("token" -> "BAD_REQUEST")
  val goodToken = Json.obj("token" -> "SUPER_TOKEN")

}

object SecurityController extends Controller with Security {

  def login = Action { implicit request =>
    request.body.asJson.map { json =>
      implicit val credentialsFormat = Json.format[Credentials]
      json.validate[Credentials].fold(
        invalid => {
          BadRequest(badToken)
        },
        valid => {
          if (checkCredentials(Json.fromJson(json).get)) {
            Ok(goodToken)
          } else {
            Unauthorized(badToken)
          }
        })
    }.getOrElse(Unauthorized)

  }

  def checkCredentials(credentials: Credentials) = {
    if (credentials.name == credentials.password) true else false
  }
}