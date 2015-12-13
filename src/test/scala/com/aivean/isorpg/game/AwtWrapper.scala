package com.aivean.isorpg.game

import java.awt.event.{ActionEvent, ActionListener}
import java.awt.{Dimension, EventQueue, Graphics, Graphics2D}
import javax.swing.{JFrame, JPanel, Timer, UIManager}

/**
  *
  * @author <a href="mailto:ivan.zaytsev@webamg.com">Ivan Zaytsev</a>
  *         2015-12-12
  */
object AwtWrapper {

  var frame: JFrame = _

  def apply(customPaint: Graphics2D => Unit) = {

    EventQueue.invokeLater(new Runnable() {
      override def run() {
        try {
          UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName)
        } catch {
          case ex: Any => {
            ex.printStackTrace()
          }
        }
        frame = new JFrame("Testing")
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)
        frame.add(new JPanel {
          val timer: Timer = new Timer(40, new ActionListener() {
            def actionPerformed(e: ActionEvent) {
              repaint()
            }
          })
          timer.start()

          override def getPreferredSize: Dimension = new Dimension(250, 250)

          override def paintComponent(g: Graphics): Unit = {
            super.paintComponent(g)
            val g2d: Graphics2D = g.create.asInstanceOf[Graphics2D]
            customPaint(g2d)
            g2d.dispose()
          }
        })
        frame.pack()
        frame.setLocationRelativeTo(null)
        frame.setVisible(true)
      }
    })
  }

}
