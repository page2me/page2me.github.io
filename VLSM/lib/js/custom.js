/*
    Document   : custom
    Created on : 27 พ.ค. 2553, 20:50:49
    Author     : e-moe
    Description: my custom javascript.
 */
/* define variable here */
/* path */
$_path_primary = 'html/primary_menu.html'
$_path_topology = 'html/topology.html'
$_path_step1 = 'html/step1.html'
$_path_step2 = 'html/step2.html'
$_path_step3 = 'html/step3.html'
$_path_subnet_routing = 'html/subnet_routing.html'
$_path_ip_summarize = 'html/ip_summarize.html'
$_path_route_summarize = 'html/route_summarize.html'
/* div */
$_div_primary = '#menu_pri'
$_div_topology = '#container'
$_div_step = '#container'
/* link */
$_link_topology = '#link_topology'
$_link_step1 = '#link_step1'
$_link_step2 = '#link_step2'
$_link_step3 = '#link_step3'
$_link_subnet_routing = '#link_subnet_routing'
$_link_ip_summarize = '#link_ip_summarize'
$_link_route_summarize = '#link_route_summarize'
/* host variable */
$_subnetted_address = 'subnetted_address_input'
$_subnetted_cidr = 'subnetted_cidr_input'
$_host_array = ["lan1_host_input","lan2_host_input","lan3_host_input","lan4_host_input","lan5_host_input","lan6_host_input","lan7_host_input"];
/* function */
/* pageload function */
/* use to inititials function on document load */
$.pageload = function(){
    /*load primary menu content*/
    $.pagecontent($_path_primary,$_div_primary);
    $.pagecontent($_path_topology,$_div_topology);
};
/* menuload function */
/* use to inititials menu handler on document load */
$.menuload = function(){
    /*load menu handler*/
    /*first page*/
    $.pagelink($_link_topology,$_path_topology,$_div_topology);
    /*second page event on finish firstpage*/
    /*
    $.pagelink($_link_step1,$_path_step1,$_div_step);
    $.pagelink($_link_step2,$_path_step2,$_div_step);
    $.pagelink($_link_step3,$_path_step3,$_div_step);
     */
    $.errormsg();
    $($_link_topology).addClass('selected');
};
$.clearclass = function(){
    $($_link_topology).removeClass('selected');
    $($_link_step1).removeClass('selected');
    $($_link_step2).removeClass('selected');
    $($_link_step3).removeClass('selected');
    $($_link_subnet_routing).removeClass('selected');
    $($_link_ip_summarize).removeClass('selected');
    $($_link_route_summarize).removeClass('selected');
    $('#main').css('height','')
};
/* validate function */
/* use to validate input information */
/* call on user keyup */
/* store data in div id hostObject and call validate_subnetted and validate_host */
$.validate = function(){
    $("input").bind('keyup', function(){
        if($(this).attr('id') == $_subnetted_address){
            $("#hostObject").data($(this).attr('id'),$(this).val());
            $.validate_subnetted($('#subnetted_address_input').val(),$('#subnetted_cidr_input').val());
            $.validate_host();
        }else if($(this).attr('id') == $_subnetted_cidr){
            $("#hostObject").data($(this).attr('id'),$(this).val());
            $.validate_subnetted($('#subnetted_address_input').val(),$('#subnetted_cidr_input').val());
            $.validate_host();
        }
        else{
            $("#hostObject").data($(this).attr('id'),$(this).val());
            $.validate_subnetted($('#subnetted_address_input').val(),$('#subnetted_cidr_input').val());
            $.validate_host();
        }
    });
};
$.validate_subnetted = function(val,cidr){
    if(val.match(/^\d+\d*\d*\.+\d*\d*\.\d+\d*\d*\.\d*\d*\d+$/)){
        var cidr_int = parseInt(cidr);
        if(cidr_int>=1 && cidr_int<=30){
            var y = val.split('.');
            var bin = new Array()
            bin[0] = $.fillzero(parseInt(y[0]).toString(2));
            bin[1] = $.fillzero(parseInt(y[1]).toString(2));
            bin[2] = $.fillzero(parseInt(y[2]).toString(2));
            bin[3] = $.fillzero(parseInt(y[3]).toString(2));

            //fixviobit
            fixvio = parseInt(bin[0].substr(0,3),2)
            nfixvio = fixvio<=3?8:fixvio<=5?16:24
            if(cidr_int<nfixvio){
                $('#description span').html('cidr ที่กำหนดไม่รองรับต่อหมายเลข Subnetted ที่กำหนด. cidr ควรมากกว่าหรือเท่ากับ' + nfixvio);
                $.errormsg();
                return false;
            }else {
                bin = bin.join('')
                if(parseInt(bin.substr(cidr_int))==0){
                    $('#description span').html('กรุณากำหนดจำนวนของ Host ที่ต้องการในแต่ละ Network segment');
                    $.errormsg();
                    return true;
                }else{
                    $('#description span').html('กรุณากรอกหมายเลข Subnetted address ที่ถูกต้อง เช่น ');
                    $('#description span').append($.convertaddress($.splitaddress(bin,cidr_int)))
                    $.errormsg();
                }
            }
        }else{
            $('#description span').html('กรุณากรอกหมายเลข CIDR ที่ถูกต้อง ที่มีค่าระหว่าง 1-30');
            $.errormsg();
        }
    }
    else{
        $('#description fieldset span').html('กรุณากรอกหมายเลข Subnetted address ที่ถูกต้อง ที่มีค่าระหว่าง 1.0.0.0 - 223.255.255.0');
        $.errormsg();
    }
};
$.validate_host = function(){
    var i=0;
    var n=0;
    var total= new Number(0);
    $('#input_form p').each(function(a,b){
        n = parseInt($(b).find('input').val());
        if(n > 0){
            ++i;
            total += $.findMaxHost(n)
        }
    });
    if(i==10){
        if(parseInt($('#subnetted_cidr_input').val())>0){
            if(Math.pow(2, 32- parseInt($('#subnetted_cidr_input').val())) >= total){
                if($.validate_subnetted($('#subnetted_address_input').val(),$('#subnetted_cidr_input').val())){
                    $('#description fieldset span').html('ยืนยันข้อมูลถูกต้อง สามารถไปยัง ขั้นตอนที่1 ได้ ')
                    $($_link_step1).unbind('click')
                    $($_link_step1).unbind('click')
                    $($_link_step2).unbind('click')
                    $($_link_step3).unbind('click')
                    $($_link_subnet_routing).unbind('click')
                    $($_link_ip_summarize).unbind('click')
                    $($_link_route_summarize).unbind('click')
                    $.pagelink($_link_step1,$_path_step1,$_div_step)
                    $.pagelink($_link_step2,$_path_step2,$_div_step)
                    $.pagelink($_link_step3,$_path_step3,$_div_step)
                    $.pagelink($_link_subnet_routing,$_path_subnet_routing,$_div_step)
                    $.pagelink($_link_ip_summarize,$_path_ip_summarize,$_div_step)
                    $.pagelink($_link_route_summarize,$_path_route_summarize,$_div_step)
                }
            }else{
                $('#description fieldset span').html('จำนวน Host ที่ต้องการมีมากกว่าหมายเลขตำแหน่งที่กำหนด กรุณาเปลี่ยนแปลงหมายเลข CIDR ให้มากขึ้น')
                $.errormsg()
            }
        }
    }else{
        $.errormsg()
    }
};
/* function */
/* use to fill information from div hostObject in page topology */
$.global_val_topology = function(){
    $('#subnetted_address_input').val($("#hostObject").data('subnetted_address_input'));
    $('#subnetted_cidr_input').val($("#hostObject").data('subnetted_cidr_input'));
    $('#lan1_host_input').val($("#hostObject").data('lan1_host_input'));
    $('#lan2_host_input').val($("#hostObject").data('lan2_host_input'));
    $('#lan3_host_input').val($("#hostObject").data('lan3_host_input'));
    $('#lan4_host_input').val($("#hostObject").data('lan4_host_input'));
    $('#lan5_host_input').val($("#hostObject").data('lan5_host_input'));
    $('#lan6_host_input').val($("#hostObject").data('lan6_host_input'));
    $('#lan7_host_input').val($("#hostObject").data('lan7_host_input'));
    $("#hostObject").data('lan4_1_input',2)
    $("#hostObject").data('lan4_2_input',2)
    $("#hostObject").data('lan4_3_input',2)
}
/* function */
/* use to fill information from div hostObject in page step1 and sorting */
$.global_val_step1 = function(){
    var x = $("#hostObject").data('subnetted_address_input');
    x = x.split('.');
    var bin = new Array()
    bin[0] = $.fillzero(parseInt(x[0]).toString(2));
    bin[1] = $.fillzero(parseInt(x[1]).toString(2));
    bin[2] = $.fillzero(parseInt(x[2]).toString(2));
    bin[3] = $.fillzero(parseInt(x[3]).toString(2));

    $('#subnetted_address_input').val($("#hostObject").data('subnetted_address_input') + '/' + $("#hostObject").data('subnetted_cidr_input'));
    $('#subnetted_bin_input').val(bin.join('.'));
    $('#lan1_host_input_before').val($("#hostObject").data('lan1_host_input'));
    $('#lan2_host_input_before').val($("#hostObject").data('lan2_host_input'));
    $('#lan3_host_input_before').val($("#hostObject").data('lan3_host_input'));
    $('#lan4_host_input_before').val($("#hostObject").data('lan4_host_input'));
    $('#lan5_host_input_before').val($("#hostObject").data('lan5_host_input'));
    $('#lan6_host_input_before').val($("#hostObject").data('lan6_host_input'));
    $('#lan7_host_input_before').val($("#hostObject").data('lan7_host_input'));
    $('#lan4_1_input_before').val($("#hostObject").data('lan4_1_input'));
    $('#lan4_2_input_before').val($("#hostObject").data('lan4_2_input'));
    $('#lan4_3_input_before').val($("#hostObject").data('lan4_3_input'));
    $('#lan1_host_input_after input').val($("#hostObject").data('lan1_host_input'));
    $('#lan2_host_input_after input').val($("#hostObject").data('lan2_host_input'));
    $('#lan3_host_input_after input').val($("#hostObject").data('lan3_host_input'));
    $('#lan4_host_input_after input').val($("#hostObject").data('lan4_host_input'));
    $('#lan5_host_input_after input').val($("#hostObject").data('lan5_host_input'));
    $('#lan6_host_input_after input').val($("#hostObject").data('lan6_host_input'));
    $('#lan7_host_input_after input').val($("#hostObject").data('lan7_host_input'));
    $('#lan4_1_host_input_after input').val($("#hostObject").data('lan4_1_input'));
    $('#lan4_2_host_input_after input').val($("#hostObject").data('lan4_2_input'));
    $('#lan4_3_host_input_after input').val($("#hostObject").data('lan4_3_input'));
    $('#lan1_host_input_after').attr('title',$("#hostObject").data('lan1_host_input'));
    $('#lan2_host_input_after').attr('title',$("#hostObject").data('lan2_host_input'));
    $('#lan3_host_input_after').attr('title',$("#hostObject").data('lan3_host_input'));
    $('#lan4_host_input_after').attr('title',$("#hostObject").data('lan4_host_input'));
    $('#lan5_host_input_after').attr('title',$("#hostObject").data('lan5_host_input'));
    $('#lan6_host_input_after').attr('title',$("#hostObject").data('lan6_host_input'));
    $('#lan7_host_input_after').attr('title',$("#hostObject").data('lan7_host_input'));
    $('#lan4_1_host_input_after').attr('title',$("#hostObject").data('lan4_1_input'));
    $('#lan4_2_host_input_after').attr('title',$("#hostObject").data('lan4_2_input'));
    $('#lan4_3_host_input_after').attr('title',$("#hostObject").data('lan4_3_input'));
    $.sorting_host_var();
};
/* sorting function */
$.sorting_host_var = function(){
    $('#sortable p').tsort({
        order:"desc",
        attr:"title"
    });
};
$.errormsg = function(){
    $($_link_step1).unbind()
    $($_link_step2).unbind()
    $($_link_step3).unbind()
    $($_link_subnet_routing).unbind()
    $($_link_ip_summarize).unbind()
    $($_link_route_summarize).unbind()

    $($_link_step1).click(function(){
        alert('ไม่สามารถใช้งานได้ กรุณาระบุข้อมูลที่หน้าแรกให้ถูกต้อง');
    });
    $($_link_step2).click(function(){
        alert('ไม่สามารถใช้งานได้ กรุณาระบุข้อมูลที่หน้าแรกให้ถูกต้อง');
    });
    $($_link_step3).click(function(){
        alert('ไม่สามารถใช้งานได้ กรุณาระบุข้อมูลที่หน้าแรกให้ถูกต้อง');
    });
    $($_link_subnet_routing).click(function(){
        alert('ไม่สามารถใช้งานได้ กรุณาระบุข้อมูลที่หน้าแรกให้ถูกต้อง');
    });
    $($_link_ip_summarize).click(function(){
        alert('ไม่สามารถใช้งานได้ กรุณาระบุข้อมูลที่หน้าแรกให้ถูกต้อง');
    });
    $($_link_route_summarize).click(function(){
        alert('ไม่สามารถใช้งานได้ กรุณาระบุข้อมูลที่หน้าแรกให้ถูกต้อง');
    });
};
/*step2 function */
$.global_val_step2 = function(){
    var major_address = $("#hostObject").data('subnetted_address_input');
    var major_cidr = $("#hostObject").data('subnetted_cidr_input');
    $('#lan1_host').attr('title',$("#hostObject").data('lan1_host_input'));
    $('#lan2_host').attr('title',$("#hostObject").data('lan2_host_input'));
    $('#lan3_host').attr('title',$("#hostObject").data('lan3_host_input'));
    $('#lan4_host').attr('title',$("#hostObject").data('lan4_host_input'));
    $('#lan5_host').attr('title',$("#hostObject").data('lan5_host_input'));
    $('#lan6_host').attr('title',$("#hostObject").data('lan6_host_input'));
    $('#lan7_host').attr('title',$("#hostObject").data('lan7_host_input'));
    $('#lan4_1').attr('title',$("#hostObject").data('lan4_1_input'));
    $('#lan4_2').attr('title',$("#hostObject").data('lan4_2_input'));
    $('#lan4_3').attr('title',$("#hostObject").data('lan4_3_input'));
    $('#host_list li').tsort({
        order:"desc",
        attr:"title"
    });
    /* need to generate first_net_address */
    var first_subnet_address = new Array();
    var first_subnet_cidr = new Array();
    $('#host_list li').each(function(c,d){
        if(c==0){
            first_subnet_address[0] = major_address;
            first_subnet_cidr[0] = major_cidr;
            $(d).addClass('selected')
        }
        var need_host = $(d).attr('title');
        var need_cidr = (32-$.hostToCIDR(need_host));
        var net_adder = $.convertaddress($.fillnzero(parseInt(Math.pow(2, 32-need_cidr)).toString(2),32));
        var b = $.addSubnet(first_subnet_address[c],net_adder)
        first_subnet_address[c+1] = b
        first_subnet_cidr[c+1] = need_cidr
    //$('#container_step2_bottom_right').append(b + "<br/>");
    });
    /* end need to generate first_net_address */
    $('#host_list li').bind('click',function(){
        $.clearclass_step2();
        $(this).addClass('selected')
        var need_host = $(this).attr('title');
        var result = 'เท็จ'
        var indexes = $(this).index();
        var nindex = (indexes >= 7 ? 2 : 3)
        var inc = 0
        //fix color
        str =  $.toBinAddr(first_subnet_address[indexes])
        ns = parseInt(first_subnet_cidr[indexes]);
        nsarraya = parseInt(ns/8)
        nsarrayb = parseInt(ns%8)
        tmp = str.substr(0,nsarraya*8)
        tmpaddr = new Array()
        tmpaddr2 = ''
        for(i=0;i<nsarraya;i++){
            tmpaddr += tmp.substr(i*8,8)+'.'
            tmpaddr2 += tmp.substr(i*8,8)
        }
        //fix viobit
        fixvio = parseInt(str.substr(0,3),2)
        nfixvio = fixvio<=3?8:fixvio<=5?16:24
        //if(tmpaddr2.length>nfixvio){
        //    s = str.substr(0,str.length-nfixvio)
        //    alert(ns + ':' + first_subnet_cidr[indexes+1] + ':' + str.length + ':' + nfixvio + ':' + (str.length-nfixvio) + ':' + s)
        //}
        subnet_cidr = first_subnet_cidr[indexes]
        class_cidr = nfixvio
        vlsm_cidr = first_subnet_cidr[indexes+1]
        nbit = str.substr(0,class_cidr)
        vbit = str.substr(class_cidr,subnet_cidr-class_cidr)
        //ybit = str.substr(subnet_cidr,vlsm_cidr-subnet_cidr)
        gbit = str.substr(subnet_cidr)
        //alert(nbit+':'+vbit+':'+ybit+':'+gbit)
        //end fix viobit
        viobit = str.substr(nsarraya*8,nsarrayb)
        greybitSubnet = str.substr(nsarraya*8+nsarrayb)

        ntmp = ''
        for(i=0;i<parseInt(nbit.length/8);i++){
            ntmp += nbit.substr(i*8,8)+'.'
        }
        vtmp = ''
        for(i=0;i<parseInt(vbit.length/8);i++){
            vtmp += vbit.substr(i*8,8)+'.'
        }
        vtmp += vbit.substr(i*8,vbit.length%8)
        gtmp = $.toBinAddressNRevM(gbit)
        resultSubnet = '<span>'+ntmp +'</span><span class="viobit">'+vtmp +'</span><span class="greybit">'+gtmp+'</span>'
        //end fix color

        //sub container cyan
        $('#container_step2_sol_left').html('<div id="cyan"></div>');
        var cyan = ('<h3>Calculate VLSM</h3>')
        cyan += ('<p><b>Subnetted Address</b> ' + first_subnet_address[indexes] + '/' + first_subnet_cidr[indexes] + '</p>')
        cyan += ('<p><b>In Binary</b> ' + resultSubnet + '</p>')
        cyan += ('<p><button id="calculateCIDR"><b>คำนวณหาเลข CIDR</b></button></p>')
        $('#cyan').html(cyan).hide().fadeIn('slow');

        //sub container navy
        $('#container_step2_sol_left').append('<div id="navy"></div>');
        vaddr = first_subnet_address[indexes]
        vcidr = parseInt(first_subnet_cidr[indexes])
        
        $('#calculateCIDR').bind('click',function(){
            //fix color
            str = $.toBinAddr(vaddr)
            ns = first_subnet_cidr[indexes]
            nv = vcidr
            nsarraya = parseInt(ns/8)
            nsarrayb = parseInt(ns%8)
            tmp = str.substr(0,nsarraya*8)
            tmpaddr = new Array()
            for(i=0;i<nsarraya;i++){
                tmpaddr += tmp.substr(i*8,8) + '.'
            }
            viobit = str.substr(nsarraya*8,nsarrayb)
            yellowbit = str.substr(nsarraya*8+nsarrayb,nv-ns )
            greybitSubnet = str.substr(nsarraya*8+nsarrayb )
            greybitVLSM = str.substr(nsarraya*8+nsarrayb+(nv-ns) )

            //fix viobit
            fixvio = parseInt(str.substr(0,3),2)
            nfixvio = fixvio<=3?8:fixvio<=5?16:24
            //if(tmpaddr2.length>nfixvio){
            //    s = str.substr(0,str.length-nfixvio)
            //    alert(ns + ':' + first_subnet_cidr[indexes+1] + ':' + str.length + ':' + nfixvio + ':' + (str.length-nfixvio) + ':' + s)
            //}
            subnet_cidr = first_subnet_cidr[indexes]
            class_cidr = nfixvio
            vlsm_cidr = vcidr
            nbit = str.substr(0,class_cidr)
            vbit = str.substr(class_cidr,subnet_cidr-class_cidr)
            ybit = str.substr(subnet_cidr,vlsm_cidr-subnet_cidr)
            gbit = str.substr(vlsm_cidr)
            ntmp = ''
            for(i=0;i<parseInt(nbit.length/8);i++){
                ntmp += nbit.substr(i*8,8)+'.'
            }
            vtmp = ''
            for(i=0;i<parseInt(vbit.length/8);i++){
                vtmp += vbit.substr(i*8,8)+'.'
            }
            vtmp += vbit.substr(i*8,vbit.length%8)
            gtmp = $.toBinAddressNRevM(gbit)
            //alert(nbit+':'+vbit+':'+ybit+':'+gbit)
            //end fix viobit

            //resultSubnet = '<span>'+tmp +'</span><span ' + (vbit==''?'':'class="viobit"') + '>'+vbit+'</span><span class="greybit">'+gbit+'</span>'
            resultVLSM = '<span>'+ntmp + '</span><span ' + (vbit==''?'':'class="viobit"') + '>'+vtmp+'</span><span ' + (ybit==''?'':'class="yellowbit"') + '>'+ybit+'</span><span class="greybit">' +gtmp+'</span>'
            var navy = ('<p><b>VLSM Address</b> '  + vaddr + '/' + vcidr + '</p>')
            navy += ('<p><b>In Binary</b> ' + resultVLSM + '</p>')
            navy += ('<table>')
            navy += ('<tr><th>n</th><th>CIDR</th><th>จำนวน PC ที่ต้องการ</th><th>จำนวน PC ที่รองรับ</th><th>ความเพียงพอ</th></tr>')
            navy += ('<tr><td> ' + (32-vcidr) + ' </td><td> ' + vcidr + ' </td><td> ' + need_host + ' </td><td> ' + (Math.pow(2,32-vcidr)-nindex) + ' </td><td> ' + (((Math.pow(2,32-vcidr)-nindex) >= (parseInt(need_host))) ? 'จริง':'เท็จ') + ' </td></tr>')
            vcidr_plus = parseInt(vcidr)+1
            if(((Math.pow(2,32-vcidr_plus)-nindex) >= (parseInt(need_host)))){
                vcidr++;
                navy += ('</table>')
            }else{
                navy += ('<tr><td> ' + (32-vcidr_plus) + ' </td><td> ' + vcidr_plus + ' </td><td> ' + need_host + ' </td><td> ' + (Math.pow(2,32-vcidr_plus)-nindex) + ' </td><td> ' + (((Math.pow(2,32-vcidr_plus)-nindex) >= (parseInt(need_host))) ? 'จริง':'เท็จ') + ' </td></tr>')
                $('#calculateCIDR').remove()
                navy += ('</table>')
                navy += ('<p><button id="calculateSubnetting"><b> ทำการ Subnetting </b></button></p>')
            }
            need_cidr = vcidr
            $('#navy').html(navy).hide().fadeIn('slow');

            init = true
            count = 1
            b = vaddr;
            net_adder = $.convertaddress($.fillnzero(parseInt(Math.pow(2, 32-need_cidr)).toString(2),32));
            total_subnet = Math.pow(2,(need_cidr-first_subnet_cidr[indexes]));
            $('#calculateSubnetting').bind('click',function(){
                if(init){
                    //sub container blud
                    init = false
                    $('#container_step2_sol_left').append('<div id="blue"></div>');
                    var blue = ('')
                }
                //generate data
                var bin = $.toBinAddr(b)
                var z = first_subnet_cidr[indexes]
                netbit = bin.substr(0,z)
                hostbit = need_cidr-z
                leavebit = bin.substr(need_cidr)
                hostbitInt = parseInt(bin.substr(z, hostbit),2)
                //fix color
                str = bin
                ns = z
                nv = need_cidr

                nsarraya = parseInt(ns/8)
                nsarrayb = parseInt(ns%8)
                tmp = str.substr(0,nsarraya*8)
                tmpaddr = new Array()
                for(i=0;i<nsarraya;i++){
                    tmpaddr += parseInt(tmp.substr(i*8,8),2)+'.'
                }        
                viobit = str.substr(nsarraya*8,nsarrayb)
                yellowbit = str.substr(nsarraya*8+nsarrayb,nv-ns )
                greybitSubnet = str.substr(nsarraya*8+nsarrayb )
                greybitVLSM = str.substr(nsarraya*8+nsarrayb+(nv-ns) )

                //fix viobit
                fixvio = parseInt(str.substr(0,3),2)
                nfixvio = fixvio<=3?8:fixvio<=5?16:24
                //if(tmpaddr2.length>nfixvio){
                //    s = str.substr(0,str.length-nfixvio)
                //    alert(ns + ':' + first_subnet_cidr[indexes+1] + ':' + str.length + ':' + nfixvio + ':' + (str.length-nfixvio) + ':' + s)
                //}
                subnet_cidr = first_subnet_cidr[indexes]
                class_cidr = nfixvio
                vlsm_cidr = first_subnet_cidr[indexes+1]
                nbit = str.substr(0,class_cidr)
                vbit = str.substr(class_cidr,subnet_cidr-class_cidr)
                ybit = str.substr(subnet_cidr,vlsm_cidr-subnet_cidr)
                gbit = str.substr(vlsm_cidr)
                //alert(nbit+':'+vbit+':'+ybit+':'+gbit)
                //end fix viobit
                viobit = str.substr(nsarraya*8,nsarrayb)
                greybitSubnet = str.substr(nsarraya*8+nsarrayb)

                ntmp = ''
                for(i=0;i<parseInt(nbit.length/8);i++){
                    ntmp += parseInt(nbit.substr(i*8,8),2)+'.'
                }
                vtmp = ''
                for(i=0;i<parseInt(vbit.length/8);i++){
                    vtmp += parseInt(vbit.substr(i*8,8),2)+'.'
                }
                vtmp += vbit.substr(i*8,vbit.length%8)
                gtmp = $.toBinAddressNRevM(gbit)


                resultVLSM = '<span class="normalbit">'+ntmp + '</span><span ' + (vbit==''?'':'class="viobit"') + '>'+vtmp+'</span><span ' + (yellowbit==''?'':'class="yellowbit"') + '>'+ybit+'</span><span class="greybit">' +gtmp+'</span>'
                if(count==1) need_net_address = $.convertaddress(bin)
                if(count==2) second_net_address = b
                               
                //end generate data
                //blue += ('<tr><td> ' + count + (count==1?"st":(count==2?"nd":(count==3?"rd":"th"))) + ' Subnet: </td><td> ' + tmpaddr + '  </td><td><span class="viobit">'+viobit+'</span></td><td><span class="yellowbit">' +yellowbit + '</span></td><td>' +greybitVLSM+'='+b+'/'+z+'</td></tr>')
                if(total_subnet>=1 && count <= total_subnet) blue = ('<p><label class="num"> '+count+''+(count==1?"st":(count==2?"nd":(count==3?"rd":"th")))+ '</label><b> Subnet:</b>'+resultVLSM +'=<span><b>'+b+'/'+nv+'</b></span></p>');
                //blue += ('<tr><th></th><th>Network</th><th>Subnet</th><th>VLSM Subnet</th><th>Host</th></tr>')
                $('#blue').append(blue).hide().fadeIn('slow');
                b = $.addSubnet(b,net_adder)
                if(count > total_subnet||count > 8){
                    if(count > total_subnet)
                        $('#calculateSubnetting').remove()
                    $('#container_step2_sol_left').append('<div id="green"></div>');
                    var green = ''
                    green += ('<p>เลือกใช้ Subnet แรกเพื่อใช้งานคือ ' + need_net_address + '/' + nv);
                    green += (' และใช้ Subnet ถัดไปคือ ' + second_net_address + '/' + nv + ' เป็น First subnet address ของการแบ่ง Subnet ถัดไป.');
                    $('#green').html(green).hide().fadeIn('slow');
                }
                    
                hostbitInt++
                count++;
            })
        })
    });
};

/*step3 function */
$.global_val_step3 = function(){
    var major_address = $("#hostObject").data('subnetted_address_input');
    var major_cidr = $("#hostObject").data('subnetted_cidr_input');
    $('#lan1_host').attr('title',$("#hostObject").data('lan1_host_input'));
    $('#lan2_host').attr('title',$("#hostObject").data('lan2_host_input'));
    $('#lan3_host').attr('title',$("#hostObject").data('lan3_host_input'));
    $('#lan4_host').attr('title',$("#hostObject").data('lan4_host_input'));
    $('#lan5_host').attr('title',$("#hostObject").data('lan5_host_input'));
    $('#lan6_host').attr('title',$("#hostObject").data('lan6_host_input'));
    $('#lan7_host').attr('title',$("#hostObject").data('lan7_host_input'));
    $('#lan4_1').attr('title',$("#hostObject").data('lan4_1_input'));
    $('#lan4_2').attr('title',$("#hostObject").data('lan4_2_input'));
    $('#lan4_3').attr('title',$("#hostObject").data('lan4_3_input'));
    $('#host_table tr.sort').tsort({
        order:"desc",
        attr:"title"
    });

    var first_subnet_address = new Array();
    var first_subnet_cidr = new Array();
    $('#host_table tr.sort').each(function(c,d){
        if(c==0){
            first_subnet_address[0] = major_address;
            first_subnet_cidr[0] = major_cidr;
        }
        var need_host = $(d).attr('title');
        var need_cidr = (32-$.hostToCIDR(need_host));
        var net_adder = $.convertaddress($.fillnzero(parseInt(Math.pow(2, 32-need_cidr)).toString(2),32));
        var b = $.addSubnet(first_subnet_address[c],net_adder)
        first_subnet_address[c+1] = b
        first_subnet_cidr[c+1] = need_cidr
        $(d).find('td.b').html(first_subnet_address[c]);
        $(d).find('td.c').html($.findBCast(b));
        $(d).find('td.d').html($.findMinAddress(first_subnet_address[c])+' - '+$.findMaxAddress($.findBCast(b)));
        $(d).find('td.e').html($.findNetmask(need_cidr));
        $(d).find('td.f').html($.findMaxAddress($.findBCast(b)));
        $(d).find('td.g').html('/'+need_cidr);
        $(d).find('td.h').html(Math.pow(2, 32-need_cidr)-(need_cidr<30?3:2));
    //$(d).find('td.f').html(Math.pow(2, 32-need_cidr)-2);
        
    });
}
/*subnet routing function*/
$.global_val_subnet_routing = function(){
    var major_address = $("#hostObject").data('subnetted_address_input');
    var major_cidr = $("#hostObject").data('subnetted_cidr_input');
    $('#LAN1_host').attr('title',$("#hostObject").data('lan1_host_input'));
    $('#LAN2_host').attr('title',$("#hostObject").data('lan2_host_input'));
    $('#LAN3_host').attr('title',$("#hostObject").data('lan3_host_input'));
    $('#LAN4_host').attr('title',$("#hostObject").data('lan4_host_input'));
    $('#LAN5_host').attr('title',$("#hostObject").data('lan5_host_input'));
    $('#LAN6_host').attr('title',$("#hostObject").data('lan6_host_input'));
    $('#LAN7_host').attr('title',$("#hostObject").data('lan7_host_input'));
    $('#R4_R1').attr('title',$("#hostObject").data('lan4_1_input'));
    $('#R4_R2').attr('title',$("#hostObject").data('lan4_2_input'));
    $('#R4_R3').attr('title',$("#hostObject").data('lan4_3_input'));
    $('#host_list li').tsort({
        order:"desc",
        attr:"title"
    });

    var first_subnet_address = new Array();
    var first_subnet_cidr = new Array();
    $('#host_list li').each(function(c,d){
        if(c==0){
            first_subnet_address[0] = major_address;
            first_subnet_cidr[0] = major_cidr;
        }
        var need_host = $(d).attr('title');
        var need_cidr = (32-$.hostToCIDR(need_host));
        var net_adder = $.convertaddress($.fillnzero(parseInt(Math.pow(2, 32-need_cidr)).toString(2),32));
        var b = $.addSubnet(first_subnet_address[c],net_adder)
        first_subnet_address[c+1] = b
        first_subnet_cidr[c+1] = need_cidr
        var baddr = $.findMinAddress(first_subnet_address[c])
        $('#subnet_routing_source').append('<optgroup label="'+$(d).attr('id')+'">')
        $('#subnet_routing_destination').append('<optgroup label="'+$(d).attr('id')+'">')
        for(i=0;i<(Math.pow(2, 32-need_cidr)-2);i++){
            $('#subnet_routing_source').append('<option>'+baddr+'/' + need_cidr + '</option>')
            $('#subnet_routing_destination').append('<option>'+baddr+'/' + need_cidr + '</option>')
            baddr = $.findMinAddress(baddr)
            if(i>=7)break;
        }
        $('#subnet_routing_source').append('</optgroup>')
        $('#subnet_routing_destination').append('</optgroup>')
    });

    $('#subnet_routing select').bind('change',function(){
        $('#container_subnet_routing_right').css('display','block').hide().slideUp(1000)
        var a = $('#subnet_routing_source').val();
        var b = $('#subnet_routing_destination').val();
        var result = $.findNetID(a,a_cidr) == $.findNetID(b,a_cidr)?'Send on Local':'Send to Router'
        var str = ''
        $('#container_subnet_routing_bottom').html(str)
        if((a.match(/^\d+\.\d+\.\d+\.\d+\/\d+$/))){
            $('#container_subnet_routing_left').css('height',630)
            var a_cidr = a.split('\/')[1]
            var b_cidr = b.split('\/')[1]
            str = '<fieldset><p>'
            str += 'ทำการหา Network ID ของ IP Source และ IP Destination'
            str += 'โดยนำ IP มา and bit กับ Subnetmask'
            str += '<h3>IP SOURCE</h3>'
            str += 'CIDR = ' + a_cidr + ' Subnetmask = ' + $.findNetmask(a_cidr) + '<br/>'
            str += '<label>Subnetmask to Binary</label> ' + $.toBinAddr($.findNetmask(a_cidr)) + '<br/>'
            str += '<label>IP Source to Binary</label> ' + $.toBinAddr(a) + '<br/>'
            str += '<label>ทำการ and bit กันจะได้</label> ' + $.toBinAddr($.findNetID(a, a_cidr)) + '<br/>'
            str += '<label>จะได้ Network ID =</label> ' + $.findNetID(a, a_cidr) + '<br/>'
            str += '</p></fieldset>'
            $('#container_subnet_routing_bottom').html(str).hide().fadeIn(1000)
        }
        if((a.match(/^\d+\.\d+\.\d+\.\d+\/\d+$/))&& (b.match(/^\d+\.\d+\.\d+\.\d+\/\d+$/))){
            str = '<fieldset><p>'
            str += 'ทำการหา Network ID ของ IP Source และ IP Destination'
            str += 'โดยนำ IP มา and bit กับ Subnetmask'
            str += '<h3>IP SOURCE</h3>'
            str += 'CIDR = ' + a_cidr + ' Subnetmask = ' + $.findNetmask(a_cidr) + '<br/>'
            str += '<label>Subnetmask to Binary</label> ' + $.toBinAddr($.findNetmask(a_cidr)) + '<br/>'
            str += '<label>IP Source to Binary</label> ' + $.toBinAddr(a) + '<br/>'
            str += '<label>ทำการ and bit กันจะได้</label> ' + $.toBinAddr($.findNetID(a, a_cidr)) + '<br/>'
            str += '<label>จะได้ Network ID =</label> ' + $.findNetID(a, a_cidr) + '<br/>'
            str += '<h3>IP DESTINATION</h3>'
            str += 'Source CIDR = ' + a_cidr + ' Source Subnetmask = ' + $.findNetmask(a_cidr) + '<br/>'
            str += '<label>Subnetmask to Binary</label> ' + $.toBinAddr($.findNetmask(a_cidr)) + '<br/>'
            str += '<label>IP Destination to Binary</label> ' + $.toBinAddr(b) + '<br/>'
            str += '<label>ทำการ and bit กันจะได้</label> ' + $.toBinAddr($.findNetID(b, a_cidr)) + '<br/>'
            str += '<label>จะได้ Network ID =</label> ' + $.findNetID(b, a_cidr) + '<br/><br/>'
            str += '<span class=subnet_routing_step1>ต่อไป</span>'
            str += '</p></fieldset>'
            $('#container_subnet_routing_bottom').html(str)
            $('.subnet_routing_step1').bind('click',function(){
                $('#container_subnet_routing_right').css('display','block').hide().slideDown(1000)
                str = '<h3>SUBNET ROUTING </h3>'
                str += 'ทำการเปรียบเทียบ Network ID ของไอพีต้นทางและปลายทาง ถ้า Network ID เหมือนกันแพคเกจจะถูกส่งภายในเครือข่าย Lan '
                str += 'แต่ถ้าไม่เหมือนกัน แพคเกจจะถูกส่งไปยัง Router จาก IPSource และ IP Destination ที่กำหนดมาจะได้ <b>' + result + '</b>'
                str += '<h3>RESULT</h3>'
                //str += '<p> <b>Source network </b> ' + $.findNetID(a, a_cidr) + ' :: <b>Destination network </b>  ' + $.findNetID(b, a_cidr) + ' </p>'
                str += '<p class="ifthen"><label><b>if</b></label><span class="a1"> '+ b +' & ' + $.findNetmask(a_cidr) + ' </span>==<span class="b1"> ' + a + ' & ' + $.findNetmask(a_cidr) + '</span></br>'
                str += '<label></label><span class=' + ($.findNetID(a,a_cidr) == $.findNetID(b,a_cidr)?"yes":"no") + '>send pkt on local network %dest ip addr in on the same subnet</span></br>'
                str += '<label><b>else</b></label></br>'
                str += '<label></label><span class=' + ($.findNetID(a,a_cidr) != $.findNetID(b,a_cidr)?"yes":"no") + '>send pkt to router %des ip addr is on diff subnet</span></br>'
                $('#container_subnet_routing_right').html(str)
                var xx = false;
                var yy = false;
                $('.a1').bind('click',function(){
                    if(xx){
                        $('.a1').html(b +' & ' + $.findNetmask(a_cidr))
                    }else{
                        $('.a1').html($.findNetID(a, a_cidr))
                    }
                    xx = !xx
                })
                $('.b1').bind('click',function(){
                    if(yy){
                        $('.b1').html(b +' & ' + $.findNetmask(b_cidr))
                    }else{
                        $('.b1').html($.findNetID(b, a_cidr))
                    }
                    yy = !yy
                })
                $('.subnet_routing_step1').remove()
            })
        }
    });
}
/*ip summarize function*/
$.global_val_ip_summarize = function(){
    var major_address = $("#hostObject").data('subnetted_address_input');
    var major_cidr = $("#hostObject").data('subnetted_cidr_input');
    $('#LAN1_host').attr('title',$("#hostObject").data('lan1_host_input'));
    $('#LAN2_host').attr('title',$("#hostObject").data('lan2_host_input'));
    $('#LAN3_host').attr('title',$("#hostObject").data('lan3_host_input'));
    $('#LAN4_host').attr('title',$("#hostObject").data('lan4_host_input'));
    $('#LAN5_host').attr('title',$("#hostObject").data('lan5_host_input'));
    $('#LAN6_host').attr('title',$("#hostObject").data('lan6_host_input'));
    $('#LAN7_host').attr('title',$("#hostObject").data('lan7_host_input'));
    $('#R4_R1').attr('title',$("#hostObject").data('lan4_1_input'));
    $('#R4_R2').attr('title',$("#hostObject").data('lan4_2_input'));
    $('#R4_R3').attr('title',$("#hostObject").data('lan4_3_input'));
    $('#host_list li').tsort({
        order:"desc",
        attr:"title"
    });
    $('#ip_summarize_router').bind('change',function(){
        var first_subnet_address = new Array();
        var first_subnet_cidr = new Array();
        var router_id = $(this).val();
        var network_attach_name = new Array();
        var network_attach_ip = new Array();
        var network_attach_name_r1 = new Array();
        var network_attach_ip_r1 = new Array();
        var network_attach_name_r2 = new Array();
        var network_attach_ip_r2 = new Array();
        var network_attach_name_r3 = new Array();
        var network_attach_ip_r3 = new Array();
        var maxCidr = 0
        var maxCidr_r1 = 0
        var maxCidr_r2 = 0
        var maxCidr_r3 = 0
        var maxCidr_r4 = 0
        $('#host_list li').each(function(c,d){
            if(c==0){
                first_subnet_address[0] = major_address;
                first_subnet_cidr[0] = major_cidr;
            }
            var need_host = $(d).attr('title');
            var need_cidr = (32-$.hostToCIDR(need_host));
            var net_adder = $.convertaddress($.fillnzero(parseInt(Math.pow(2, 32-need_cidr)).toString(2),32));
            var b = $.addSubnet(first_subnet_address[c],net_adder)
            first_subnet_address[c+1] = b
            first_subnet_cidr[c+1] = need_cidr
            if(router_id == 'R1'){
                if(($(d).attr('id')=='LAN1_host')||$(d).attr('id')=='LAN2_host'){
                    network_attach_ip.push(first_subnet_address[c]+'/'+need_cidr)
                    network_attach_name.push($(d).attr('id'))
                    if(need_cidr>maxCidr_r1)
                        maxCidr_r1 = need_cidr
                }
            }else if(router_id == 'R2'){
                if(($(d).attr('id')=='LAN3_host')||$(d).attr('id')=='LAN4_host'){
                    network_attach_ip.push(first_subnet_address[c]+'/'+need_cidr)
                    network_attach_name.push($(d).attr('id'))
                    if(need_cidr>maxCidr_r2)
                        maxCidr_r2 = need_cidr
                }
            }else if(router_id == 'R3'){
                if(($(d).attr('id')=='LAN5_host')||$(d).attr('id')=='LAN6_host'){
                    network_attach_ip.push(first_subnet_address[c]+'/'+need_cidr)
                    network_attach_name.push($(d).attr('id'))
                    if(need_cidr>maxCidr_r3)
                        maxCidr_r3 = need_cidr
                }
            }else if(router_id == 'R4'){
                if(($(d).attr('id')=='LAN1_host')||$(d).attr('id')=='LAN2_host'){
                    network_attach_ip_r1.push(first_subnet_address[c]+'/'+need_cidr)
                    network_attach_name_r1.push($(d).attr('id'))
                }else if(($(d).attr('id')=='LAN3_host')||$(d).attr('id')=='LAN4_host'){
                    network_attach_ip_r2.push(first_subnet_address[c]+'/'+need_cidr)
                    network_attach_name_r2.push($(d).attr('id'))
                }else if(($(d).attr('id')=='LAN5_host')||$(d).attr('id')=='LAN6_host'){
                    network_attach_ip_r3.push(first_subnet_address[c]+'/'+need_cidr)
                    network_attach_name_r3.push($(d).attr('id'))
                }

                if(network_attach_ip_r1.length==2){
                    cidr = $.summaryAddress(network_attach_ip_r1[0], network_attach_ip_r1[1]).split('/')[1]
                    if(cidr>maxCidr_r4)
                        maxCidr_r4 = cidr
                    network_attach_ip.push($.summaryAddress(network_attach_ip_r1[0], network_attach_ip_r1[1]))
                    network_attach_name.push('R1')
                    network_attach_ip_r1 = new Array()
                }
                if(network_attach_ip_r2.length==2){
                    cidr = $.summaryAddress(network_attach_ip_r2[0], network_attach_ip_r2[1]).split('/')[1]
                    if(cidr>maxCidr_r4)
                        maxCidr_r4 = cidr
                    network_attach_ip.push($.summaryAddress(network_attach_ip_r2[0], network_attach_ip_r2[1]))
                    network_attach_name.push('R2')
                    network_attach_ip_r2 = new Array()
                }
                if(network_attach_ip_r3.length==2){
                    cidr = $.summaryAddress(network_attach_ip_r3[0], network_attach_ip_r3[1]).split('/')[1]
                    if(cidr>maxCidr_r4)
                        maxCidr_r4 = cidr
                    network_attach_ip.push($.summaryAddress(network_attach_ip_r3[0], network_attach_ip_r3[1]))
                    network_attach_name.push('R3')
                    network_attach_ip_r3 = new Array()
                }
            }
        });
        if(router_id == 'R1'){
            maxCidr = maxCidr_r1
        }else if(router_id == 'R2'){
            maxCidr = maxCidr_r2
        }else if(router_id == 'R3'){
            maxCidr = maxCidr_r3
        }else if(router_id == 'R4'){
            maxCidr = maxCidr_r4
        }
        $('#second').html('')
        if(network_attach_ip.length>0){
            $('#second').append('<TABLE class="netseg">')
            $('#second').append('<TR class="netseg"><TH class="netseg">Network segment</TH><TH class="netseg">Network ID</TH></TR>')
            for(i=0;i<network_attach_ip.length;i++){
                $('#second').append('<TR class="netseg"><TD class="netseg">'+network_attach_name[i].split('_')[0]+'</TD><TD class="netseg">'+network_attach_ip[i]+'</TD></TR>')
            }
            $('#second').append('</TABLE>')
            $('#second').append('<br/><span class="ipsum_step1">ต่อไป</span>')
            $('.ipsum_step1').bind('click',function(){
                $('.ipsum_step1').remove()
                if(network_attach_ip.length==1){
                    $('#second').append('<p>เนื่องจากมีเพียง Network เดียวไม่จำเป็นต้องทำการ Summarize</p>')
                }else{
                    var e = ($.toBinAddr(network_attach_ip[0])).split('')
                    var f = ($.toBinAddr(network_attach_ip[1])).split('')
                    var result = ''
                    for(n=0;n<e.length;n++){
                        if(e[n]!=f[n]){
                            result += '0'
                        }else{
                            result += '1'
                        }
                    }
                    var common_num = (result.split('0')[0]).length
                    bit_num = maxCidr;
                    $('#second').append('<H3><button id="calculateSummarize"><b>Summarizing Within an Octet</b></button></H3>')
                    $('#second').append('<TABLE id="tab"></TABLE>')
                    $('#calculateSummarize').bind('click',function(){
                        for(i=0;i<network_attach_ip.length;i++){
                            if(i==0)$('#tab').html('<TR><TD class="white">'+network_attach_ip[i]+'</TD><TD class="yellow">'+$.toBinAddressN(($.toBinAddr(network_attach_ip[i])).substr(0, bit_num),bit_num)+'</TD><TD class="green">'+$.toBinAddressNRev(($.toBinAddr(network_attach_ip[i])).substr(bit_num))+'</TD></TR>')
                            else $('#tab').append('<TR><TD class="white">'+network_attach_ip[i]+'</TD><TD class="yellow">'+$.toBinAddressN(($.toBinAddr(network_attach_ip[i])).substr(0, bit_num),bit_num)+'</TD><TD class="green">'+$.toBinAddressNRev(($.toBinAddr(network_attach_ip[i])).substr(bit_num))+'</TD></TR>')
                        }
                        if(bit_num==common_num||common_num==32){
                            $('#calculateSummarize').remove()
                            $('#tab').append('<TR><TD class="white"></TD><TD class="white"><b>Number of Common Bits = '+bit_num+'<br/>Summary:'+$.findNetID(network_attach_ip[0],bit_num) + '/' + bit_num+'</b></TD><TD class="white"><b>Noncommon Bits = ' + (32-bit_num) + '</b></TD></TR>')
                        }
                        bit_num--;
                    })
                }
            })
        }
    })

}
$.global_val_route_summarize = function(){
    $('#main').css('height',1100)
    $('#container_route_summarize').css('height',950)
    var type = 0;//0=summarize,1=non summarize
    $('#routing_list li').bind('click',function(){
        type = $(this).index()
        $('#a1').trigger('click')
        $.clearclass_('#routing_list')
        $(this).addClass('selected')
    });
    var ro_table_1 = new routerObject('#table_R1')
    var ro_table_2 = new routerObject('#table_R2')
    var ro_table_3 = new routerObject('#table_R3')
    var ro_table_4 = new routerObject('#table_R4')
    var bool = false;
    var fix = 0;
    $('#routing_action_list li').bind('click',function(){
        $.clearclass_('#routing_action_list')
        $(this).addClass('selected')
        var action = $(this).index()
        switch(action){
            //coldstart
            case 0:
                $('#routing_action h3').html($(this).text())
                $.coldstart(type);
                ro_table_1 = $.fill_router_table('#table_R1 tr',new routerObject('#table_R1'))
                ro_table_2 = $.fill_router_table('#table_R2 tr',new routerObject('#table_R2'))
                ro_table_3 = $.fill_router_table('#table_R3 tr',new routerObject('#table_R3'))
                ro_table_4 = $.fill_router_table('#table_R4 tr',new routerObject('#table_R4'))
                break;
            //initial change
            //update information*/
            case 1:
                $('#routing_action h3').html($(this).text())
                
                if(type==1){
                    fix = 0
                //}else if((type==0)&&((fix%2)==1)){
                }else if((type==0)){
                    //----------------
                    //  $('#a2').trigger('click')
                    ro_table_1_old = ro_table_1
                    ro_table_2_old = ro_table_2
                    ro_table_3_old = ro_table_3
                    ro_table_4_old = ro_table_4
                    //backup old data into backup table
                    ro_table_1.updateTable('#table_R1_old')
                    ro_table_2.updateTable('#table_R2_old')
                    ro_table_3.updateTable('#table_R3_old')
                    ro_table_4.updateTable('#table_R4_old')
                    //alert(ro_table_1_old._net.length)
                    ro_table_1 = $.fill_router_table('#table_R4 tr',ro_table_1_old)
                    ro_table_2 = $.fill_router_table('#table_R4 tr',ro_table_2_old)
                    ro_table_3 = $.fill_router_table('#table_R4 tr',ro_table_3_old)
                    ro_table_4 = $.fill_router_table('#table_R1 tr',ro_table_4_old)
                    ro_table_4 = $.fill_router_table('#table_R2 tr',ro_table_4)
                    ro_table_4 = $.fill_router_table('#table_R3 tr',ro_table_4)
                    //alert(ro_table_1_old._net.length)
                    ro_table_1.distinct()
                    ro_table_2.distinct()
                    ro_table_3.distinct()
                    ro_table_4.distinct()
                    ro_table_1.isContain($.fill_router_table('#table_R1_old tr',new routerObject('#table_R1_old')))
                    ro_table_2.isContain($.fill_router_table('#table_R2_old tr',new routerObject('#table_R2_old')))
                    ro_table_3.isContain($.fill_router_table('#table_R3_old tr',new routerObject('#table_R3_old')))
                    ro_table_4.isContain($.fill_router_table('#table_R4_old tr',new routerObject('#table_R4_old')))
                    ro_table_1.updateTable(ro_table_1._name)
                    ro_table_2.updateTable(ro_table_2._name)
                    ro_table_3.updateTable(ro_table_3._name)
                    ro_table_4.updateTable(ro_table_4._name)
                    //----------------/
                    
                    ro_table_1.summarize()
                    ro_table_2.summarize()
                    ro_table_3.summarize()
                    ro_table_4.summarize()
                    //backup old data into backup table
                    //ro_table_1.updateTable(ro_table_1._name)
                    //ro_table_2.updateTable(ro_table_2._name)
                    //ro_table_3.updateTable(ro_table_3._name)
                    //ro_table_4.updateTable(ro_table_4._name)
                        
                    $('#table_R1 tr.sort').tsort({
                        order:"asc",
                        attr:"title"
                    });
                    $('#table_R2 tr.sort').tsort({
                        order:"asc",
                        attr:"title"
                    });
                    $('#table_R3 tr.sort').tsort({
                        order:"asc",
                        attr:"title"
                    });
                    $('#table_R4 tr.sort').tsort({
                        order:"asc",
                        attr:"title"
                    });
                    //do summary table
                    fix++
                    break;
                }

                //  $('#a2').trigger('click')
                ro_table_1_old = ro_table_1
                ro_table_2_old = ro_table_2
                ro_table_3_old = ro_table_3
                ro_table_4_old = ro_table_4
                //backup old data into backup table
                ro_table_1.updateTable('#table_R1_old')
                ro_table_2.updateTable('#table_R2_old')
                ro_table_3.updateTable('#table_R3_old')
                ro_table_4.updateTable('#table_R4_old')
                //alert(ro_table_1_old._net.length)
                ro_table_1 = $.fill_router_table('#table_R4 tr',ro_table_1_old)
                ro_table_2 = $.fill_router_table('#table_R4 tr',ro_table_2_old)
                ro_table_3 = $.fill_router_table('#table_R4 tr',ro_table_3_old)
                ro_table_4 = $.fill_router_table('#table_R1 tr',ro_table_4_old)
                ro_table_4 = $.fill_router_table('#table_R2 tr',ro_table_4)
                ro_table_4 = $.fill_router_table('#table_R3 tr',ro_table_4)
                //alert(ro_table_1_old._net.length)
                ro_table_1.distinct()
                ro_table_2.distinct()
                ro_table_3.distinct()
                ro_table_4.distinct()
                ro_table_1.isContain($.fill_router_table('#table_R1_old tr',new routerObject('#table_R1_old')))
                ro_table_2.isContain($.fill_router_table('#table_R2_old tr',new routerObject('#table_R2_old')))
                ro_table_3.isContain($.fill_router_table('#table_R3_old tr',new routerObject('#table_R3_old')))
                ro_table_4.isContain($.fill_router_table('#table_R4_old tr',new routerObject('#table_R4_old')))
                ro_table_1.updateTable(ro_table_1._name)
                ro_table_2.updateTable(ro_table_2._name)
                ro_table_3.updateTable(ro_table_3._name)
                ro_table_4.updateTable(ro_table_4._name)
                $('#table_R1 tr.sort').tsort({
                    order:"asc",
                    attr:"title"
                });
                $('#table_R2 tr.sort').tsort({
                    order:"asc",
                    attr:"title"
                });
                $('#table_R3 tr.sort').tsort({
                    order:"asc",
                    attr:"title"
                });
                $('#table_R4 tr.sort').tsort({
                    order:"asc",
                    attr:"title"
                });
                break;
        }
    });
    $('#a1').trigger('click')
}
$.fill_router_table = function(routerTableName,newObject){
    var Object = new routerObject()
    Object.getObject(newObject)
    //alert('bf'+newObject._net.length)
    $(routerTableName).find('td').each(function(a,b){
        var el = $(b).html()
        if(el.match(/^\d+\.\d+\.\d+\.\d+/)){
            Object._net.push(el)
        }else if(el.match(/\w\d\/\d\/*\d*/)){
            if(Object._name == routerTableName.split(' ')[0]){
                Object._interface.push(el)
            }else if(Object._name == '#table_R4'){
                if(routerTableName.split(' ')[0]=='#table_R1'){
                    Object._interface.push('S0/0/0')
                }else if(routerTableName.split(' ')[0]=='#table_R2'){
                    Object._interface.push('S0/0/1')
                }else if(routerTableName.split(' ')[0]=='#table_R3'){
                    Object._interface.push('S0/1/0')
                }
            }else {
                Object._interface.push('S0/0/0')
            }
        }else if(el.match(/\w+/)){
            if(Object._name == routerTableName.split(' ')[0]){
                Object._hop.push(el)
            }else {
                el = parseInt(el)+1
                Object._hop.push(el)
            }
        }
    })
    //Object.getObject();
    //alert('af'+newObject._net.length)
    return Object
}
function routerObject(name){
    this._name = name;
    this._net = new Array()
    this._interface = new Array()
    this._hop = new Array()
    this._stat = new Array()
    this.getObject = function(obj){
        this._name = obj._name
        this._net = obj._net
        this._interface = obj._interface
        this._hop = obj._hop
        this._stat = obj._stat
    }
    this.updateTable = function(name){
        $(name).html('<tr><th>Network</th><th>Interface</th><th>Hop</th></tr>').hide().delay(500).slideDown(1000)
        var n = this._net.length
        for(i=0;i<n;i++){
            var str = ('<TR class="sort ' + this._stat[i] + '" title=' + this._interface[i] + '><TD class="network">'+this._net[i]+'</TD><TD class="interface">'+this._interface[i]+'</TD><TD class="hop">'+this._hop[i]+'</TD></TR>')
            $(name).append(str)
        //alert(this._stat[i])
        }
    }
    this.summarize = function(){
        //solution
        snet = new Array()
        sn = this._net.length
        match = 0;
        newnet = new Array()
        newint = new Array()
        newhop = new Array()
        for(ab=0;ab<sn;ab++){
            tmpab = new Array()
            for(cd=0;cd<sn;cd++){
                if((this._hop[ab]==this._hop[cd])&&(this._interface[ab]==this._interface[cd])){
                    match++;
                    tmpab.push(cd)
                }
            }
            if(match>1){
                if(snet.indexOf(tmpab.join(';'))==-1){
                    snet.push(tmpab.join(';'))
                }
            }else {
                newnet.push(this._net[ab])
                newint.push(this._interface[ab])
                newhop.push(this._hop[ab])
            }
            match = 0;
        }
        snetlength = snet.length
        while(snet.length>0){
            net = snet.pop()
            netb = net.split(';')
            netblength = netb.length
            for(ef=0;ef<32;ef++){
                ij=0
                nhop = ''
                ninterface = ''
                for(gh=0;gh<netblength;gh++){
                    ij += parseInt($.toBinAddr(this._net[netb[gh]]).charAt(ef))
                    nhop = this._hop[netb[gh]]
                    ninterface = this._interface[netb[gh]]
                }
                if(!(ij==netblength || ij==0)){
                    break;
                }
            }
            //alert(ef)
            //alert(this._net[netb[0]].split('/')[0] + '/' + ef)
            newnet.push(this._net[netb[0]].split('/')[0] + '/' + ef)
            newint.push(ninterface)
            newhop.push(nhop)
        }
        //this._net = newnet
        //this._interface = newint
        //this._hop = newhop
        //alert(this._net.length)
        //alert(newnet.length)
        $(this._name).html('<tr><th>Network</th><th>Interface</th><th>Hop</th></tr>').hide().delay(500).slideDown(1000)
        var n = newnet.length
        for(i=0;i<n;i++){
            var str = ('<TR class="sort ' + this._stat[i] + '" title=' + newint[i] + '><TD class="network">'+newnet[i]+'</TD><TD class="interface">'+newint[i]+'</TD><TD class="hop">'+newhop[i]+'</TD></TR>')
            $(this._name).append(str)
        //alert(this._stat[i])
        }
    //alert(this._net)
    }
    this.distinct = function(){
        var buf_network = new Array()
        var buf_interface = new Array()
        var buf_hop = new Array()
        var buf_stat = new Array()
        //solution
        //1. หาตำแหน่งซ้ำ ex. {1,3} ถ้าไม่มีจบการทำงาน
        //2. หาค่าที่น้อยที่สุด
        //3. เก็บค่าที่น้อยสุดลง Object ใหม่
        //4. ตัดค่าที่ซ้ำออกจาก Object เดิม
        //5. ทำซ้ำข้อ 1
        if(this._name=='#table_R4'){}
        //alert(this._name)
        for(j=0;j<this._net.length;j++){
            //do1
            if(this._name=='#table_R4'){}
            //alert(this._net[j])
            var count = this.findAddress(this._net[j])
            var n = count.length;
            var min = 0;//count[0] = lowtest index
            if(n>1){
                //do2
                for(i=0;i<n;i++){
                    //loop all in array
                    var val = count[i]//val is hop index
                    var minval = count[min]
                    if(this._hop[val]<=this._hop[minval]){
                        min = i
                    }
                }
                //end do2
                //do3
                buf_network.push(this._net[count[min]])
                buf_interface.push(this._interface[count[min]])
                buf_hop.push(this._hop[count[min]])
                //end do3
                //do4
                for(i=0;i<n;i++){
                    //loop all in array
                    val = count[i]//val is hop index
                    val = (val-i)
                    this._net.splice(val,1)
                    this._interface.splice(val,1)
                    this._hop.splice(val,1)
                }
                //alert(this._net)
                j=0;
            //end do4
            }
        //end do1
        }
        //alert(this._name)
        if(buf_network.length>0){
            for(i=0;i<buf_network.length;i++){
                this._net.push(buf_network[i])
                this._interface.push(buf_interface[i])
                this._hop.push(buf_hop[i])
            //alert(buf_network[i])
            }
        }
    }
    this.findAddress = function(addr){
        var count = new Array()
        for(i=0;i<this._net.length;i++){
            if(addr == this._net[i]){
                count.push(i)
            }
        }
        return count
    }
    this.isContain = function(OldObject){
        //alert(this._net.length+':'+OldObject._net.length)
        //fix solution clear stat
        for(j=0;j<this._net.length;j++){
            this._stat[j]='new'
            for(i=0;i<OldObject._net.length;i++){
                if(this._net[j]==OldObject._net[i]){
                    this._stat[j]='old'
                }
            }
        }
    }
}
$.coldstart = function(type){
    var major_address = $("#hostObject").data('subnetted_address_input');
    var major_cidr = $("#hostObject").data('subnetted_cidr_input');
    $('#lan1_host').attr('title',$("#hostObject").data('lan1_host_input'));
    $('#lan2_host').attr('title',$("#hostObject").data('lan2_host_input'));
    $('#lan3_host').attr('title',$("#hostObject").data('lan3_host_input'));
    $('#lan4_host').attr('title',$("#hostObject").data('lan4_host_input'));
    $('#lan5_host').attr('title',$("#hostObject").data('lan5_host_input'));
    $('#lan6_host').attr('title',$("#hostObject").data('lan6_host_input'));
    $('#lan7_host').attr('title',$("#hostObject").data('lan7_host_input'));
    $('#R4_R1').attr('title',$("#hostObject").data('lan4_1_input'));
    $('#R4_R2').attr('title',$("#hostObject").data('lan4_2_input'));
    $('#R4_R3').attr('title',$("#hostObject").data('lan4_3_input'));
    $('#host_list li').tsort({
        order:"desc",
        attr:"title"
    });
    var first_subnet_address = new Array();
    var first_subnet_cidr = new Array();
    var R1_sum = new Array()
    var R2_sum = new Array()
    var R3_sum = new Array()
    var R4_sum = new Array()
    $('#table_R1').html('<tr><th>Network</th><th>Interface</th><th>Hop</th></tr>').slideUp(1000).delay(400)
    $('#table_R2').html('<tr><th>Network</th><th>Interface</th><th>Hop</th></tr>').slideUp(1000).delay(400)
    $('#table_R3').html('<tr><th>Network</th><th>Interface</th><th>Hop</th></tr>').slideUp(1000).delay(400)
    $('#table_R4').html('<tr><th>Network</th><th>Interface</th><th>Hop</th></tr>').slideUp(1000).delay(400)
    $('#host_list li').each(function(c,d){
        if(c==0){
            first_subnet_address[0] = major_address;
            first_subnet_cidr[0] = major_cidr;
        }
        var need_host = $(d).attr('title');
        var need_cidr = (32-$.hostToCIDR(need_host));
        var net_adder = $.convertaddress($.fillnzero(parseInt(Math.pow(2, 32-need_cidr)).toString(2),32));
        var b = $.addSubnet(first_subnet_address[c],net_adder)
        first_subnet_address[c+1] = b
        first_subnet_cidr[c+1] = need_cidr
        var a;
        var b;
        //update conntected network into router
        if(type==0){
            if($(d).attr('id')=='lan1_host'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan2_host'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan3_host'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan4_host'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan5_host'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan6_host'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan7_host'){
                a = '#table_R4'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R1'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R2'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R3'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/1/0</TD><TD class="hop">0</TD></TR>')
            }
        /*
            var id = $(d).attr('id')
            if((id=='lan1_host')||(id=='lan2_host')){
                R1_sum.push(first_subnet_address[c]+'/'+need_cidr)
                if(R1_sum.length==2){
                    a = '#table_R1'
                    b = ('<TR><TD class="network">'+$.summaryAddress(R1_sum[0],R1_sum[1])+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
                }
            }else if((id=='lan3_host')||(id=='lan4_host')){
                R2_sum.push(first_subnet_address[c]+'/'+need_cidr)
                if(R2_sum.length==2){
                    a = '#table_R2'
                    b = ('<TR><TD class="network">'+$.summaryAddress(R2_sum[0],R2_sum[1])+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
                }
            }else if((id=='lan5_host')||(id=='lan6_host')){
                R3_sum.push(first_subnet_address[c]+'/'+need_cidr)
                if(R3_sum.length==2){
                    a = '#table_R3'
                    b = ('<TR><TD class="network">'+$.summaryAddress(R3_sum[0],R3_sum[1])+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
                }
            }else if((id=='lan7_host')){
                R4_sum.push(first_subnet_address[c]+'/'+need_cidr)
                a = '#table_R4'
                b = ('<TR><TD class="network">'+(R4_sum[0])+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R1'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R2'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R3'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/1/0</TD><TD class="hop">0</TD></TR>')
            }
            */
        }else if(type==1){
            if($(d).attr('id')=='lan1_host'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan2_host'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan3_host'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan4_host'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan5_host'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan6_host'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='lan7_host'){
                a = '#table_R4'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/'+need_cidr+'</TD><TD class="interface">E0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R1'){
                a = '#table_R1'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R2'){
                a = '#table_R2'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/1</TD><TD class="hop">0</TD></TR>')
            }else if($(d).attr('id')=='R4_R3'){
                a = '#table_R3'
                b = ('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/0/0</TD><TD class="hop">0</TD></TR>')
                $('#table_R4').append('<TR><TD class="network">'+first_subnet_address[c]+'/30</TD><TD class="interface">S0/1/0</TD><TD class="hop">0</TD></TR>')
            }
        }
        $(a).append(b).delay(300).slideDown(1000)
    });
}
/* etc function */
$.pagecontent = function (path,div){
    $.ajax({
        url: path,
        success: function(data) {
            $(div).html(data);
        }
    });
}
$.pagelink = function(link,path,div){
    $(link).click(function(){
        $.pagecontent(path,div);
        $.clearclass();
        $(link).addClass('selected');
    });
}
$.fillzero = function(binaryStr){
    var zero = ["00000000","0000000","000000","00000","0000","000","00","0",''];
    return zero[binaryStr.length] + binaryStr;
}
$.fillnzero = function(bin,n){
    var dif = n - bin.length;
    for(i=0;i<dif;i++){
        bin = '0'+bin
    }
    return bin;
}
$.splitaddress = function(bin,cidr){
    bin = bin.substr(0,cidr)
    var dif = 32-cidr
    for(i=0;i<dif;i++){
        bin += '0'
    }
    return bin;
}
$.convertaddress = function(bin){
    var bin_array = new Array()
    bin_array[0] = parseInt(bin.substr(0,8),2)
    bin_array[1] = parseInt(bin.substr(8,8),2)
    bin_array[2] = parseInt(bin.substr(16,8),2)
    bin_array[3] = parseInt(bin.substr(24,8),2)
    return (bin_array.join('.'));
}
$.findMaxHost = function(host){
    host = parseInt(host)
    if(host>0){
        host += 2;
        for(n=1;n<32;n++){
            var cal = Math.pow(2, n);
            if(host<=cal){
                return cal;
                break;
            }
        }
    }
    return null;
}
$.toBinAddr = function(addr){
    addr = addr.split('.');
    var bin = new Array()
    bin[0] = $.fillzero(parseInt(addr[0]).toString(2));
    bin[1] = $.fillzero(parseInt(addr[1]).toString(2));
    bin[2] = $.fillzero(parseInt(addr[2]).toString(2));
    bin[3] = $.fillzero(parseInt(addr[3]).toString(2));
    return bin.join('')
}
$.hostToCIDR = function(need_host){
    nindex = (need_host>2)?3:2;
    for(n=1;n<32;n++){
        if(need_host <= (Math.pow(2, n)-nindex)){
            break;
        }
    }
    return n;
}
$.addSubnet = function(a,b){
    a = a.split('.')
    b = b.split('.')
    for(i=3;i>=0;i--){
        b[i] = parseInt(a[i]) + parseInt(b[i])
        if(i==0)break;
        if(b[i]==256){
            b[i-1] = parseInt(b[i-1]);
            b[i-1]++;
            b[i] = 0;
        }
    }
    b = b.join('.')
    return b;
}
$.findBCast = function(b){
    b = b.split('.')
    b[3] = (b[3]-1)
    if(b[3]==-1){
        b[2] = (b[2]-1)
        b[3] = 255;
    }
    if(b[2]==-1){
        b[1] = (b[1]-1)
        b[2] = 255;
    }
    if(b[1]==-1){
        b[0] = (b[0]-1)
        b[1] = 255;
    }
    b = b.join('.')
    return b;
}
$.findMinAddress = function(b){
    b = b.split('.')
    b[3] = parseInt(b[3])+1
    b = b.join('.')
    return b;
}
$.findMaxAddress = function(b){
    b = b.split('.')
    b[3] = (b[3]-1)
    b = b.join('.')
    return b;
}
$.findNetmask = function(cidr){
    var a = Math.pow(2, 32)
    var b = Math.pow(2, 32-cidr)
    a -= b
    return $.convertaddress(a.toString(2))
}
$.findNetID = function(ip,cidr){
    var bin = $.toBinAddr(ip).substr(0, cidr)
    var dif = 32 - bin.length;
    for(i=0;i<dif;i++){
        bin = bin + '0'
    }
    return $.convertaddress(bin);
}
$.clearclass_step2 = function(){
    $('#host_list li').find('.selected').removeClass('selected')
};
$.clearclass_ = function(where){
    $(where).find('.selected').removeClass('selected')
};
$.summaryAddress = function(netA,netB){
    var e = ($.toBinAddr(netA)).split('')
    var f = ($.toBinAddr(netB)).split('')
    var result = ''
    for(n=0;n<=e.length;n++){
        if(e[n]!=f[n]){
            result += '0'
        }else{
            result += '1'
        }
    }
    var common_num = (result.split('0')[0]).length
    return $.findNetID(netA,common_num)+'/'+common_num 
}
$.toDecimalAddress = function(tmp,cidr){
    tmpaddr = ''
    for(k=0;k<parseInt(cidr/8);k++){
        tmpaddr += parseInt(tmp.substr(k*8,8),2)+' . '
    }
    return tmpaddr + tmp.substr(k*8);
}
$.toBinAddressN = function(tmp,cidr){
    tmpaddr = ''
    for(k=0;k<parseInt(cidr/8);k++){
        tmpaddr += tmp.substr(k*8,8)+' . '
    }
    return tmpaddr + tmp.substr(k*8);
}
$.toBinAddressNRev = function(bin){
    tmp = ''
    c = parseInt(bin.length/8)
    for(l=0;l<c;l++){
        tmp =  ' . ' + bin.substr(bin.length-8,8) + tmp
        bin = bin.substr(0,bin.length-8)
    }
    return (bin + tmp)
}
$.toBinAddressNRevN = function(bin){
    tmp = ''
    c = parseInt(bin.length/8)
    for(l=0;l<c;l++){
        tmp +=  ' . ' + parseInt(bin.substr(bin.length-8,8),2)
        bin = bin.substr(0,bin.length-8)
    }
    return (bin + tmp)
}
$.toBinAddressNRevM = function(bin){
    tmp = ''
    c = parseInt(bin.length/8)
    for(l=0;l<c;l++){
        if(l+1==c){
            tmp = bin.substr(bin.length-8,8) + tmp
        }else 
            tmp =  '.' + bin.substr(bin.length-8,8) + tmp
        bin = bin.substr(0,bin.length-8)
    }
    if(bin.length>0&&c>0)
        bin = bin+'.'
    return (bin + tmp)
}
/*debug mode*/
/* function */
/* use to fill information from div hostObject in page topology */
$.debug_global_val_topology = function(){
    $("#hostObject").data('subnetted_address_input','172.16.0.0');
    $("#hostObject").data('subnetted_cidr_input','16');
    $("#hostObject").data('lan1_host_input','500');
    $("#hostObject").data('lan2_host_input','10');
    $("#hostObject").data('lan3_host_input','20');
    $("#hostObject").data('lan4_host_input','200');
    $("#hostObject").data('lan5_host_input','800');
    $("#hostObject").data('lan6_host_input','400');
    $("#hostObject").data('lan7_host_input','120');
}
