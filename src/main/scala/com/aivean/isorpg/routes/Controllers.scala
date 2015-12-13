package com.aivean.isorpg.routes

import com.aivean.isorpg.game.{VisibilityFilter, Face, Cube, Point}
import xitrum.Action
import xitrum.annotation.GET

import scala.util.Random


trait View {
  this: Action =>
  def execute() {
    respondView()
  }
}

@GET("")
class Index extends View with DefaultLayout

@GET("demo1")
class GpuVisibility extends View with WebGLLayout

@GET("demo2")
class BackendVisibility extends WebGLLayout {

  def execute() {
    var w = Set[Point]()

    for(x <- -10 to 10; y <- -10 to 10) {
      w += Point(x, y, (Math.abs(x) + Math.abs(y)) / 4)
    }

    val faces = w.map(Cube.apply).flatMap(_.faces).toSeq

    val char = Point(0,0,2)
    val camera = char.moved(-10, -10, 10)

    val charFaces = VisibilityFilter(char, faces)
    val cameraFaces = VisibilityFilter(camera, faces).diff(charFaces)

    def toJson(f:Face) = Map("p" -> f.p, "rot" -> Map("x" -> f.ft.x, "y" -> f.ft.y, "z" -> f.ft.z))

    at("faceData") = Map(
      "char" -> char,
      "camera" -> camera,
      "faces" -> (charFaces.map(f => toJson(f) + ("v" -> true)) ++
        cameraFaces.map(f => toJson(f) + ("v" -> false)))
    )

    respondView()
  }
}

