package tq;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

@RequestMapping("/test")
@Controller
public class TestController {

	static private String token;

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET)
	public String test() {
		ChannelService channelService = ChannelServiceFactory
				.getChannelService();
		if (token == null) {
			token = channelService.createChannel("clientId");
		}
		channelService.sendMessage(new ChannelMessage("clientId", "hello"));
		return token;
	}

}
