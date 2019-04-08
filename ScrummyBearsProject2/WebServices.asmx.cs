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

       public bool LogOn(string username, string pass)
        {
            bool success = false;

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT Username FROM User WHERE Username=@nameValue and Password=@passValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@nameValue", HttpUtility.UrlDecode(username));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();
            sqlDa.Fill(sqlDt);

            if(sqlDt.Rows.Count > 0)
            {
                //if a user is found, store them in the session
                Session["Username"] = sqlDt.Rows[0]["username"];
                success = true;
            }
            return success;
        }

        [WebMethod(EnableSession = true)]
        public Survey[] GetSurveys()
        {
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
                //of our container class survey.  Fill each survey with
                //data from the rows, then dump them in a list.
                List<Survey> surveys = new List<Survey>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    surveys.Add(new Survey
                    {
                        surveyId = sqlDt.Rows[i]["SurveyID"].ToString(),
                        surveyName = sqlDt.Rows[i]["Sname"].ToString()
                    });
                }
                //convert the list of surveys to an array and return!
                return surveys.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Survey[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public Survey LoadSurvey(string surveyId)
        {
            if (Session["Username"] != null)
            {
                Survey surv = new Survey();

                DataTable sqlDt = new DataTable("surveys");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "SELECT QuestionID, QuestionText FROM Question WHERE SurveyID=@surveyIdValue";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@surveyIdValue", HttpUtility.UrlDecode(surveyId));

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                
                surv.questions = new List<String>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    surv.questions.Add(sqlDt.Rows[i]["QuestionText"].ToString());
                }
                //convert the list of surveys to an array and return!
                return surv;
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Survey();
            }
        }
    }
}
