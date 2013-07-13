import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "GeoStreams"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm
  )


  val backend = Project ("backend", file("modules/backend"))


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  ) dependsOn (backend)

}
