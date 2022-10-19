#!/usr/bin/env python
# coding: utf-8

# In[1]:


# selenium 4
from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
import pickle

# In[3]:


# Vores fake browser objekt
browser = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))


# In[5]:


from selenium.webdriver.common.by import By


# In[12]:


#log ing function
def login(browser):
    browser.get('https://oddsjam.com/auth/login')
    browser.implicitly_wait(5)

    ## Link to signup
    ## finds login box
    signin_link = browser.find_element(By.ID, "login-email")
    ## inputs email
    signin_link.send_keys("REDACTED")
    ### click to login
    log_in = browser.find_element(By.XPATH,"//form/button/div")
    log_in.click()
    browser.implicitly_wait(5)        
    return browser


# In[13]:


## We log in her
## You will get a magic just click it manaully in another browser
login(browser)


# In[16]:


def getOddsChart(browser):
    ## Go to Arbitage page
    browser.get("https://oddsjam.com/betting-tools/arbitrage")
    ## Get table of odds
    content = browser.find_element(By.XPATH,"//html/body/div[1]/div/main/div/div[2]/div/div[2]/div")
    return content


# In[17]:

pickle.dump( browser.get_cookies() , open("cookies.pkl","wb"))

content = getOddsChart(browser)

print(content.text)
print(f"Type of data is: {type(content)}")
# In[18]:




