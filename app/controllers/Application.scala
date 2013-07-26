package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json
import play.api.libs.json._

object Application extends Controller {
  

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }
  

  def apiStatus = Action {
  	Ok(Json.toJson("Status Ok"))
  }

  def apiDefault = api("v1")

  def api(version:String) = Action {
  	Ok(Json.toJson("OK, " + version))
  }

  def login = Action {
    Ok(Json.toJson("SUPER_TOKEN"))
  }
}