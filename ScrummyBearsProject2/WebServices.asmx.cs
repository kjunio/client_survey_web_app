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
        public void ProvideFeedback(string username, string feedbackNum, string feedbackType, string feedbackText, string feedbackTags, string anonnymity)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //need to execute a select statement that first pulls userid based on username and then an insert based on user id
            string sqlSelect = "select UserID from user where Username=@nameValue";
            string sqlInsert = "insert into Feedback (surveyid, userid, feedbackSub, feedbackText, feedbackTags, anonymity) " +
                "values(@surveyValue, @idValue, @subjectValue, @textValue, @feedbackTags, @anonymityvalue);";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);
            MySqlCommand sqlCommand2 = new MySqlCommand(sqlInsert, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@nameValue", HttpUtility.UrlDecode(username));
            sqlCommand2.Parameters.AddWithValue("@surveyValue", HttpUtility.UrlDecode(feedbackNum));
            sqlCommand2.Parameters.AddWithValue("@subjectValue", HttpUtility.UrlDecode(feedbackType));
            sqlCommand2.Parameters.AddWithValue("@textValue", HttpUtility.UrlDecode(feedbackText));
            sqlCommand2.Parameters.AddWithValue("@surveyTags", HttpUtility.UrlDecode(feedbackTags));
            sqlCommand2.Parameters.AddWithValue("@anonymityValue", HttpUtility.UrlDecode(anonnymity));

            //this time, we're not using a data adapter to fill a data table.  We're just
            //opening the connection, telling our command to "executescalar" which says basically
            //execute the query and just hand me back the number the query returns the ID
            //then we run a second query with the id
            sqlConnection.Open();
            try
            {
                //execute command and return id
                int userID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                //add userid as parameter
                sqlCommand2.Parameters.AddWithValue("@idValue", userID);

                //execute command and store results
                sqlCommand2.ExecuteScalar();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
        }
        //EXAMPLE OF A SELECT, AND RETURNING "COMPLEX" DATA TYPES
        /*[WebMethod(EnableSession = true)]
        public Account[] GetAccounts()
        {
            //check out the return type.  It's an array of Account objects.  You can look at our custom Account class in this solution to see that it's 
            //just a container for public class-level variables.  It's a simple container that asp.net will have no trouble converting into json.  When we return
            //sets of information, it's a good idea to create a custom container class to represent instances (or rows) of that information, and then return an array of those objects.  
            //Keeps everything simple.

            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["id"] != null)
            {
                DataTable sqlDt = new DataTable("accounts");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select id, userid, pass, firstname, lastname, email from account where active=1 order by lastname";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                List<Account> accounts = new List<Account>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    if (Convert.ToInt32(Session["admin"]) == 1)
                    {
                        accounts.Add(new Account
                        {
                            id = Convert.ToInt32(sqlDt.Rows[i]["id"]),
                            userId = sqlDt.Rows[i]["userid"].ToString(),
                            password = sqlDt.Rows[i]["pass"].ToString(),
                            firstName = sqlDt.Rows[i]["firstname"].ToString(),
                            lastName = sqlDt.Rows[i]["lastname"].ToString(),
                            email = sqlDt.Rows[i]["email"].ToString()
                        });
                    }
                    else
                    {
                        accounts.Add(new Account
                        {
                            id = Convert.ToInt32(sqlDt.Rows[i]["id"]),
                            firstName = sqlDt.Rows[i]["firstname"].ToString(),
                            lastName = sqlDt.Rows[i]["lastname"].ToString(),
                            email = sqlDt.Rows[i]["email"].ToString()
                        });
                    }
                }
                //convert the list of accounts to an array and return!
                return accounts.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Account[0];
            }
        }*/
    }
}
