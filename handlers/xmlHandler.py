from base import *
from tornado import escape
import json
import os
from subprocess import call
from shutil import move

from tornadomail.message import EmailMessage
from tornadomail.backends.smtp import EmailBackend
from email.mime.image import MIMEImage
from datetime import datetime


BASE_DIR = os.path.dirname(os.path.realpath(__file__))



################################################################################################
# xmlHandler
# noinspeBASE_DIRction PyAbstractClass
class xmlHandler(BaseHandler):

    @property
    def mail_connection(self):
        return EmailBackend(
            'smtp.gmail.com', 587, 'noriwebinterface@gmail.com', 'noriwebinterface1',
            True
        )

    def sendMail(self, userMail, pngPath):
        img_data = open(pngPath, 'rb').read()
        imgAttachment = MIMEImage(img_data, name=os.path.basename(pngPath))
        curDate = datetime.now()
        subject = 'Rendering from ' + str(curDate)
        msg = 'Rendering from nori.'
        message = EmailMessage(
            subject,
            msg,
            'noriwebinterface@gmail.com',
            [userMail],
            connection=self.mail_connection,
            attachments=[imgAttachment]
        )
        message.send()
    """
    This class is a handler for xml requests queries on the following url: /data/lineQuery


    @author: Alexander Lelidis
    @contact: alexlelidis@gmx.de
    @version: 1.0

    """
    # @tornado.web.authenticated
    def post(self):
        """
        Handle http post requests.
        """
        user = self.get_current_user()

        print "New xml request from " + user

        # check if the user has a directory if not create it
        userDir  = BASE_DIR + '/../app/data/' + user
        if not os.path.exists(userDir):
            os.makedirs(userDir)
            os.makedirs(userDir + '/img')
            os.makedirs(userDir + '/xml')
            os.makedirs(userDir + '/exr')
            os.makedirs(userDir + '/obj')

        # extract the query
        xmlQuery = json.loads(self.request.body)
        filePath = userDir+ "/xml/" + xmlQuery['fileName']
        pureFileName = xmlQuery['fileName'].split('.')[0]
        sendMail = xmlQuery['sendMail']

        # write save the xml file
        textFile = open(filePath, "w")
        textFile.write(xmlQuery['xmlData'])
        textFile.close()

        # run the render
        print "running nori on :" + filePath
        call(["./NoriV2/build/nori", filePath, '0', '0'])

        # move the file to exr directory
        exrFileName = pureFileName + '.exr'
        destPath = userDir + "/xml/" + exrFileName
        srcPath = userDir + "/exr/" + exrFileName
        move(destPath, srcPath)

        # convert the exr file to an image
        pngPath = userDir + "/img/" + pureFileName + '.png'
        convComand = "convert " + srcPath + ' -gamma 2.2 ' + pngPath
        os.system(convComand)

        # return the rendered image url
        data = {
            'imgUrl': userDir + "/img/" + pureFileName + '.png'
        }
        # serve the image
        # f = Image.open(pngPath)
        # io = StringIO()
        # f.save(io, 'PNG')
        # pngImageData = io.getvalue()

        # check if the rendering should be send via email
        if sendMail:
            self.sendMail(xmlQuery['email'], pngPath)

        # serve the image url
        jsonData = escape.json_encode(data)

        self.write(jsonData)
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
