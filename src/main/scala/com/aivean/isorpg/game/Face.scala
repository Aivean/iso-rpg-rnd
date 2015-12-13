package com.aivean.isorpg.game

import com.aivean.isorpg.game.Face.FaceType

/**
  *
  * @author <a href="mailto:ivan.zaytsev@webamg.com">Ivan Zaytsev</a>
  *         2015-12-12
  */

case class Face(p: Point, ft: FaceType) {
  def points = ft.points(p)

  def faces(p1:Point) =
      p.x * ft.x <= p1.x * ft.x &&
      p.y * ft.y <= p1.y * ft.y &&
      p.z * ft.z <= p1.z * ft.z

  def center = {
    val pts = points
    val p1 = pts.reduce((p1,p2)=> p1.moved(p2.x, p2.y, p2.z))
    Point(p1.x / pts.size, p1.y / pts.size, p1.z / pts.size)
  }
}

object Face {

  sealed trait FaceType {
    def x = 0
    def y = 0
    def z = 0

    def points(p:Point) =
      if (x != 0) Seq(p, p.moved(y = 1), p.moved(y = 1, z = 1), p.moved(z = 1))
      else if (y != 0) Seq(p, p.moved(x = 1), p.moved(x = 1, z = 1), p.moved(z = 1))
      else Seq(p, p.moved(x = 1), p.moved(x = 1, y = 1), p.moved(y = 1))
  }

  case object X_+ extends FaceType {
    override def x = 1
  }

  case object X_- extends FaceType {
    override def x = -1
  }

  case object Y_+ extends FaceType {
    override def y = 1
  }

  case object Y_- extends FaceType {
    override def y = -1
  }

  case object Z_+ extends FaceType {
    override def z = 1
  }

  case object Z_- extends FaceType {
    override def z = -1
  }

}