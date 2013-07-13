name := "GeoStreams"
 
version := "1.0-SNAPSHOT"
 
scalaVersion := "2.10.2"
 
resolvers ++= Seq(
	"Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
	"snapshots" at "http://oss.sonatype.org/content/repositories/snapshots",
     "releases"  at "http://oss.sonatype.org/content/repositories/releases"
)

//akkaVersion := "2.2.0"
 
libraryDependencies ++= Seq (
	  "com.typesafe.akka" %% "akka-actor" % "2.2.0", //akkaVersion
	  "com.typesafe.akka" %% "akka-testkit" % "2.2.0",
	  "org.scalatest" %% "scalatest" % "1.9.1" % "test"
)



seq(Revolver.settings: _*)  