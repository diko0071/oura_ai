from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import os 

def openai_call(human_message, system_message):
    llm = ChatOpenAI(model_name="gpt-4o-2024-05-13", temperature=0, api_key=os.getenv("OPENAI_API_KEY"))
    chat = llm
    messages = [
    SystemMessage(
        content=f'{system_message}.'
    ),
    HumanMessage(content=human_message),
        ]
    
    response = chat.invoke(messages)

    return response.content 