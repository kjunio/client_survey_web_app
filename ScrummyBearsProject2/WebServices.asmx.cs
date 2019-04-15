using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace ScrummyBearsProject2
{
    /// <summary>
    /// Summary description for WebServices
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class WebServices : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public int LogOn(string username, string pass)
        {
            int userid = 0;

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT Username, UserID FROM User WHERE Username=@nameValue and Password=@passValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@nameValue", HttpUtility.UrlDecode(username));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();
            sqlDa.Fill(sqlDt);

            if (sqlDt.Rows.Count > 0)
            {
                //if a user is found, store them in the session
                Session["UserID"] = sqlDt.Rows[0]["userid"];
                Session["Username"] = sqlDt.Rows[0]["username"];
                //if a user is found, return their id 
                userid = Convert.ToInt32(sqlDt.Rows[0]["userid"]);
            }
            return userid;
        }

        [WebMethod(EnableSession = true)]
        public Survey[] GetSurveys()
        {
            //check out the return type.  It's an array of Account objects.  You can look at our custom Account class in this solution to see that it's 
            //just a container for public class-level variables.  It's a simple container that asp.net will have no trouble converting into json.  When we return
            //sets of information, it's a good idea to create a custom container class to represent instances (or rows) of that information, and then return an array of those objects.  
            //Keeps everything simple.

            if (Session["Username"] != null)
            {
                DataTable sqlDt = new DataTable("surveys");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "SELECT SurveyID, Sname FROM Survey";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                List<Survey> surveys = new List<Survey>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!

                    surveys.Add(new Survey
                    {
                        surveyId = sqlDt.Rows[i]["SurveyID"].ToString(),
                        surveyName = sqlDt.Rows[i]["Sname"].ToString()
                    });
                }
                //convert the list of accounts to an array and return!
                return surveys.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Survey[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public void ProvideFeedback(string userid, string feedbackNum, string feedbackType, string feedbackText, string feedbackTags, string anonymity)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlInsert = "INSERT INTO feedback (SurveyID, UserID, FeedbackSubject, FeedbackText,  Tags, Anonymtiy) " +
                "VALUES (@surveyValue, @idValue, @subjectValue, @textValue, @feedbackTags, @anonymityvalue);";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlInsert, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@surveyValue", HttpUtility.UrlDecode(feedbackNum));
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(userid));
            sqlCommand.Parameters.AddWithValue("@subjectValue", HttpUtility.UrlDecode(feedbackType));
            sqlCommand.Parameters.AddWithValue("@textValue", HttpUtility.UrlDecode(feedbackText));
            sqlCommand.Parameters.AddWithValue("@feedbackTags", HttpUtility.UrlDecode(feedbackTags));
            sqlCommand.Parameters.AddWithValue("@anonymityValue", HttpUtility.UrlDecode(anonymity));

            //we are using executenonquery to run a query that does not return any values
            sqlConnection.Open();
            try
            {
                //execute command and store results
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
        }
        
        /*
        //shell method
        [WebMethod(EnableSession = true)]
        public void StoreAnswers( string surveyid, string answerarray)
        {
            //decode variables passed from the page
            int surveyID = HttpUtility.UrlDecode(surveyid);
            answer[] answers = HttpUtility.UrlDecode(answerarray);

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            foreach( answer a in answers)
            {
                //loop through and assign selected answers attributes to temp variables
                int questionID = a.QuestionID;
                int answerID = a.AnswerID;

                //create insert statement 
                string sqlInsert = "INSERT INTO result (QuestionID, AnswerID, SurveyID, UserID) VALUES (@questionID, @answerID, @surveyID, @userID);";
                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlInsert, sqlConnection);
                
                sqlCommand.Parameters.AddWithValue("@questionID", questionID);
                sqlCommand.Parameters.AddWithValue("@answerID", answerID);
                sqlCommand.Parameters.AddWithValue("@surveyID", surveyID);
                sqlCommand.Parameters.AddWithValue("@userID", Convert.ToInt32(Session["UserID"]));
 
                sqlConnection.Open();
                try
                {
                    //execute command and store results
                    sqlCommand.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                }
                sqlConnection.Close();
            }
        }*/

        [WebMethod(EnableSession = true)]
        public int ProgressMade()
        {
            //variable to be returned, integer so easily used as percent
            int percentProgress = 0;
            //variables used to calculate progress
            double progressMade = 0.0;
            int surveysAvailable = 0;
            int surveysCompleted = 0;

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            //sql statment to pull count of userID from completion table to see how many surveys have been completed by that user
            string sqlSelectCompleted = "SELECT COUNT( SurveyID ) FROM surveycompletion WHERE UserID = @userID";
            //sql statement to pull count of available surveys
            string sqlSelectAvailable = "SELECT COUNT( SurveyID ) FROM survey";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommandCompleted = new MySqlCommand(sqlSelectCompleted, sqlConnection);
            MySqlCommand sqlCommandAvailable = new MySqlCommand(sqlSelectAvailable, sqlConnection);

            sqlCommandCompleted.Parameters.AddWithValue("@userID", Convert.ToInt32(Session["UserID"]));

            //execute commands and assign them to variables
            surveysCompleted = Convert.ToInt32(sqlCommandCompleted.ExecuteScalar());
            surveysAvailable = Convert.ToInt32(sqlCommandAvailable.ExecuteScalar());

            //assign progress to a double in case it does not divide evenly
            progressMade = (surveysCompleted / surveysAvailable)*100;

            //round progress to nearest integer
            percentProgress = Convert.ToInt32(Math.Round(progressMade));

            //returns the progress as an integer to the page that called it
            return percentProgress;
        }

        [WebMethod(EnableSession = true)]
        public string[] HideCompletedSurveys()
        {
            //data table to hold ids of completed surveys
            DataTable sqlDt = new DataTable("completedSurveys");

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            //selects each survey id the user has completed
            string sqlSelect = "SELECT SurveyID FROM surveycompletion WHERE UserID = @userID";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@userID", Convert.ToInt32(Session["UserID"]));

            //execute command and store ids in table 
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            sqlDa.Fill(sqlDt);

            //goees through each row in the data table
            //converts each integer into a string and places them in a list
            List<string> surveyIDList = new List<string>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                surveyIDList.Add(sqlDt.Rows[i]["SurveyID"].ToString());
            }

            //converts list to array and returns
            return surveyIDList.ToArray();
        }
    }
}
