package com.aivean.isorpg.game

import java.awt.geom.Area
import java.awt.{Color, Polygon, Rectangle}

import com.aivean.isorpg.game.Face.X_+
import org.scalatest.FunSuite

import scala.util.Random

/**
  *
  * @author <a href="mailto:ivan.zaytsev@webamg.com">Ivan Zaytsev</a>
  *         2015-12-12
  */
class AwtShapesTest extends FunSuite {

  def createPoly(ps: (Int, Int)*) =
    new Polygon(ps.map(_._1).toArray, ps.map(_._2).toArray, ps.size)

  test("awt shapes") {
    val rect1 = new Rectangle(100, 100, 100, 100)

    val poly = createPoly((110, 110), (150, 150), (150, 110))

    val area = new Area(rect1)
    area.subtract(new Area(poly))

    println(area.isEmpty)

    area.getBounds

    AwtWrapper { g =>
      g.setColor(Color.red)
      g.draw(rect1)

      g.setColor(Color.green)
      g.draw(poly)

      g.setColor(new Color(1, 0, 0, 0.2f))
      g.fill(area)
    }
    scala.io.StdIn.readLine()
  }

  /*
        ^ z
        |
        |
        |_______>
       /       y
      /
   x v

    */
  test("draw room") {
    case class Point2D(x: Float, y: Float) {
      def t = (x.toInt, y.toInt)
    }

    def projectZ(cam: Point, f: Float)(p: Point) = {
      Point2D((p.x - cam.x) * (f / (p.z - cam.z)), (p.y - cam.y) * (f / (p.z - cam.z)))
    }

//    def faces(p: Point) = Seq(p, p.east, p.north.east, p.north).map(projectZ(Point(0, 0, 0), 50))

    val world = Set(
      Point(3, 0, 1),
      Point(4, 0, 1)
//      Point(1, 1, 1),
//      Point(1, 1, 2),
//      Point(1, 1, 3),
//      Point(-1, 1, 3),
//      Point(-1, 2, 3),
//      Point(-1, -2, 3)
    )

    val center = Point(0,0,0)
    val project = projectZ(center, -100) _

    val area = new Area()
    val polys = world.toList.flatMap {
      p => /*val p1 = new Area(createPoly(faces(p).map(_.t): _*))
        p1.subtract(area)
        area.add(p1)
        p1*/
        Cube(p).faces.filter(_.faces(center))
        //createPoly(faces(p).map(_.t): _*)
    }.sortBy(_.center.distTo(center)).flatMap {
      f =>
        val p = createPoly(f.points.map(project).map(_.t): _*)
        val pa = new Area(p)
        pa.subtract(area)
        area.add(pa)

        Some(pa).filter(_ => !pa.isEmpty)
    }

    println(polys)

    AwtWrapper { g =>
      val bounds = g.getClipBounds
      g.translate(bounds.width / 2, bounds.height / 2)
      g.scale(1, -1)
      val r = new Random(1234)

      polys.foreach{ p =>
        g.setColor(new Color(r.nextFloat(), r.nextFloat(), r.nextFloat(), 0.2f))
        g.fill(p)
      }
    }

    scala.io.StdIn.readLine()
  }

}
